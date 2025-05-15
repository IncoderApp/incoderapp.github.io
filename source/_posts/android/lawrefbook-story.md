---
title: Lawrefbook 遇到问题
date: 2022-07-01 11:11:11
categories: Android
tags: 中国法律
description: 《中国法律》应用开发过程中遇到的问题
cover: https://res.cloudinary.com/incoder/image/upload/v1654225417/incoderapp/lawrefbook/lawrefbook-banner.png
copyright_url: https://incoder.app/2022/07/01/lawrefbook1/
archive_img: https://res.cloudinary.com/incoder/image/upload/v1654225417/incoderapp/lawrefbook/lawrefbook-banner.png
top_img: https://res.cloudinary.com/incoder/image/upload/v1654225417/incoderapp/lawrefbook/lawrefbook-banner.png
---

Lawrefbook 项目开发过程中遇到了不少问题，本篇文章记录面对问题的思考与实践。

在完成初始版本后，数据源从 2022.5.1 结构由 [JSON](https://github.com/LawRefBook/Laws/blob/abe3daaa448d225a37606118eaa4796d05b2c01c/data.json) 变更成 [sqlite3](https://github.com/LawRefBook/Laws/blob/abe3daaa448d225a37606118eaa4796d05b2c01c/laws.db) 数据库，因此从 1.1.0 版本开始进行了适配，刚好可以再次熟悉下数据库的相关操作。

## submodule 与 subtree

早期分别使用过 submodule 和 subtree 对项目中的子项目进行管理，当时也没有细致去区分这两种模式适用的场景

|                  | **submodule**                                                                            | **subtree**                      | **结果**                            |
|------------------|------------------------------------------------------------------------------------------|----------------------------------|-----------------------------------|
| 远程仓库空间占用 | submodule 只是引用，基本不占用额外空间                                                    | 子模块 copy，会占用较大的额外空间 | submodule 占用空间较小，略优         |
| 本地空间占用     | 可根据需要下载                                                                           | 会下载整个项目                   | 所有模块基本都要下载，二者差异不大   |
| 仓库克隆         | 克降后所有子模块为空，需要注册及更新，同时更新后还需切换分支                               | 克隆之后即可使用                 | submodule 步骤略多，subtree 占优     |
| 更新本地仓库     | 更新后所有子模块后指向最后一次提交，更新后需要重新切回分支，所有子模块只需一条更新语句即可 | 所有子模块需要单独更新           | 各有优劣，相对 subtree 更好用一些    |
| 提交本地修改     | 只需关心子模块即可，子模块的所有操作与普通 git 项目相同                                   | 提交执行命令相对复杂一些         | submodule 操作更简单，submodule 占优 |

经过对两种方式的比较

* submodule：适用于**只仅仅**是引用子模块，并不涉及到对子模块项目的修改，例如：这次 Lawrefbook 项目的中的数据源管理，其实就很适合用 submodule 方式
* subtree：适用于引用子模块，除此之外还能在宿主项目中对子模块项目做更改并提交推送到子模块的源仓库

[Git子库：submodule与subtree](https://juejin.cn/post/6844904132411654157)

## SQLite3 与 Room

Android 上数据库除了最初的 SQLite 还在 Jetpact 组件中新增了 Room 数据库，因此同步源数据，可以有两个方案

1. 方案一：依然使用源数据的 SQLite，本质是 Copy assets 路径下数据库到应用内部默认位置 `/data/data/<application package name>/databases` 下
2. 方案二：迁移源数据的 SQLite 到 Room 数据库，Room 数据库已经支持了 [SQLite 数据库的迁移 API](https://developer.android.google.cn/training/data-storage/room/sqlite-room-migration)

综上两个方案都不难，看自己的选择。

> 由于应用的收藏功能，就已经用上了 Room 数据库，再使用 Room 提供的 SQLite 迁移 API 如果库名一样会覆盖之前的数据库（当然你可以和之前收藏不在同一个 Room 数据库，就不会覆盖啦），因此我这里使用了方案一，刚好也可以熟悉了 SQLite

### 列重命名

在迁移数据之前，我还有一个需求，需要对之前收藏表进行重命名列名，操作步骤如下

1. 在应用的 model 级别的 build.gradle 文件的 defaultConfig 内添加数据库的 schema

   ```groovy
    defaultConfig {

        // 其他配置这里省略
        ……

        // https://developer.android.google.cn/training/data-storage/room/migrating-db-versions#export-schema
        javaCompileOptions {
            annotationProcessorOptions {
                arguments += ["room.schemaLocation": "$projectDir/database".toString()]
            }
        }
    }
   ```

2. 字段重命名策略，如下

    ```java
    /**
     * 原 category 列名，更该为 classify
     */
    @RenameColumn(tableName = "libraries", fromColumnName = "category", toColumnName = "classify")
    static class Libraries1To2AutoMigration implements AutoMigrationSpec {
    }
    ```

3. 修改对应表的实体字段
4. 配置数据库的升级策略

   ```java
   @Database(entities = {Libraries.class}, 
        // 更新当前数据库的版本
        version = 2,
        // 配置自动迁移策略
        autoMigrations = {@AutoMigration(from = 1, to = 2, spec = AppDatabase.Libraries1To2AutoMigration.class)}
    )
   ```

### 数据迁移

做完了对原 Room 数据库表（`libraries`）的字段更新，接着分别使用两种方案对数据做迁移

#### 方案一

对于源数据我们只需要有查询操作，不涉及到对数据的写入，因此我们只需要关注抽象类 `SQLiteOpenHelper` 中 `getReadableDatabase()` 方法来打开我们的数据库

1. 我们先将 assets 路径下的数据库，Copy 存放在应用内部默认位置 `/data/data/<application package name>/databases` 下，应用启动时调用该方法

    ```java
    public static void packDataBase(Context context) {
        // internal
        @SuppressLint("SdCardPath")
        // specify the path within the app
        String internalPath = "/data/data/app.incoder.lawrefbook/databases";
        // source file
        String sqliteName = "/db.sqlite3";
        // external
        String originPath = "Laws" + sqliteName;
        // check internal SQLite is exist
        if (!(new File(internalPath + sqliteName)).exists()) {
            File f = new File(internalPath);
            // if databases category is not exist
            if (!f.exists()) {
                if (f.mkdir()) {
                    System.out.println("create databases");
                }
            }
            try {
                InputStream is = context.getAssets().open(originPath);
                OutputStream os = new FileOutputStream(internalPath + sqliteName);
                byte[] buffer = new byte[1024];
                int length;
                while ((length = is.read(buffer)) > 0) {
                    os.write(buffer, 0, length);
                }
                os.flush();
                os.close();
                is.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
    ```

2. 我们需要使用 Android SDK 内自带的 SQLite 相关的 API

    ```java
    /**
    * Sqlite3Helper
    *
    * @author : Jerry xu
    * @since : 2022/6/5 18:03
    */
    public class Sqlite3Helper extends SQLiteOpenHelper {

        private static final String DATABASE_NAME = "db.sqlite3";
        private static final int DATABASE_VERSION = 1;

        public Sqlite3Helper(@Nullable Context context) {
            super(context, DATABASE_NAME, null, DATABASE_VERSION);
        }

        @Override
        public void onCreate(SQLiteDatabase db) {

        }

        @Override
        public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {

        }
    }
    ```

3. 使用单例的方式，创建读取 SQLite 数据库内容的方法

    ```java
    /**
    * Sqlite3Dao
    *
    * @author : Jerry xu
    * @since : 2022/6/5 18:16
    */
    public class Sqlite3Dao {

        private volatile SQLiteDatabase mLite;

        /**
        * 获取单例
        *
        * @return Sqlite3Dao
        */
        public static Sqlite3Dao getInstance() {
            return SingletonHolder.INSTANCE;
        }

        /**
        * 在访问数据库时创建单例
        */
        private static class SingletonHolder {
            private static final Sqlite3Dao INSTANCE = new Sqlite3Dao();
        }

        public Sqlite3Dao() {

        }

        public SQLiteDatabase getSqlite(Context context) {
            if (mLite == null) {
                synchronized (Sqlite3Dao.class) {
                    if (mLite == null) {
                        mLite = new Sqlite3Helper(context).getReadableDatabase();
                    }
                }
            }
            return mLite;
        }

        public static List<Category> categoryList(Context context) {
            return getCategory(Sqlite3Dao.getInstance().getSqlite(context));
        }

        public static List<Law> lawList(Context context, Integer categoryId) {
            return getLaw(Sqlite3Dao.getInstance().getSqlite(context), categoryId);
        }

        /**
        * 查询 category 表
        *
        * @param sqlite sqlite
        * @return 查询结果
        */
        private static List<Category> getCategory(SQLiteDatabase sqlite) {
            Cursor category = sqlite.rawQuery("SELECT * FROM category ORDER BY `order`", null);
            List<Category> result = new ArrayList<>();
            if (null != category) {
                if (category.moveToFirst()) {
                    do {
                        int id = category.getInt(category.getColumnIndexOrThrow("id"));
                        String name = category.getString(category.getColumnIndexOrThrow("name"));
                        String folder = category.getString(category.getColumnIndexOrThrow("folder"));
                        Integer subFolder = category.getInt(category.getColumnIndexOrThrow("isSubFolder"));
                        String group = category.getString(category.getColumnIndexOrThrow("group"));
                        Integer order = category.getInt(category.getColumnIndexOrThrow("order"));
                        Category roomCategory = Category.builder()
                                .id(id)
                                .name(name)
                                .folder(folder)
                                .isSubFolder(subFolder)
                                .group(group)
                                .order(order)
                                .build();
                        result.add(roomCategory);
                    } while (category.moveToNext());
                }
                category.close();
            }
            return result;
        }

        /**
        * 查询 law 表
        *
        * @param sqlite sqlite
        * @return 查询结果
        */
        private static List<Law> getLaw(SQLiteDatabase sqlite, Integer categoryIds) {
            Cursor law;
            if (categoryIds != null) {
                law = sqlite.rawQuery("SELECT * FROM law WHERE category_id = ? ORDER BY `order`", new String[]{categoryIds.toString()});
            } else {
                law = sqlite.rawQuery("SELECT * FROM law ORDER BY `order`", null);
            }
            List<Law> result = new ArrayList<>();
            if (null != law) {
                if (law.moveToFirst()) {
                    do {
                        String id = law.getString(law.getColumnIndexOrThrow("id"));
                        String level = law.getString(law.getColumnIndexOrThrow("level"));
                        String name = law.getString(law.getColumnIndexOrThrow("name"));
                        String filename = law.getString(law.getColumnIndexOrThrow("filename"));
                        String publish = law.getString(law.getColumnIndexOrThrow("publish"));
                        String expired = law.getString(law.getColumnIndexOrThrow("expired"));
                        Integer categoryId = law.getInt(law.getColumnIndexOrThrow("category_id"));
                        Integer order = law.getInt(law.getColumnIndexOrThrow("order"));
                        String subtitle = law.getString(law.getColumnIndexOrThrow("subtitle"));
                        String validFrom = law.getString(law.getColumnIndexOrThrow("valid_from"));
                        Law roomLaw = Law.builder()
                                .id(id)
                                .level(level)
                                .name(name)
                                .filename(filename)
                                .publish(publish)
                                .expired(expired)
                                .categoryId(categoryId)
                                .order(order)
                                .subtitle(subtitle)
                                .validFrom(validFrom)
                                .build();
                        result.add(roomLaw);
                    } while (law.moveToNext());
                }
                law.close();
            }
            return result;
        }
    }
    ```

Law，Category 为数据库对应的实体表

```java
@Data
@Builder
public class Category implements Serializable {

    private int id;
    private String name;
    private String folder;
    private Integer isSubFolder;
    private String group;
    private Integer order;
}
```

```java
@Data
@Builder
public class Law implements Serializable {

    private String id;
    /*** 法律效力位阶 */
    private String level;
    private String name;
    private String filename;
    /*** 施行日期 */
    private String publish;
    /*** 时效性 0-有效，1-已修改（已废止）*/
    private String expired;
    private Integer categoryId;
    private Integer order;
    private String subtitle;
    /*** 公布日期 */
    private String validFrom;
}
```

#### 方案二

迁移 SQLite 数据到 Room 数据库，可以按照如下步骤进行

1. 项目添加 Room 相关的依赖，由于项目之前使用过 Room，这里就不重复添加 Room 的相关依赖
2. 更改源 SQLite 数据库表的实例对象为 Room 数据库对象，按需添加 Room 的 [androidx.room](https://developer.android.google.cn/reference/androidx/room/Entity) 路径下相关的注解即可
   * Category 数据库对象

    ```java
    @Data
    @Builder
    public class Category implements Serializable {

        private int id;
        private String name;
        private String folder;
        private Integer isSubFolder;
        private String group;
        private Integer order;
    }
    ```

   * Category 数据库对象

    ```java
    @Data
    @Builder
    public class Category implements Serializable {

        private int id;
        private String name;
        private String folder;
        private Integer isSubFolder;
        private String group;
        private Integer order;
    }
    ```

3. 定义访问 Room 数据库的方法（DAO）
4. 创建数据库对象类
   > 由于项目的收藏已创建过 Room 数据库（`lawre_room`）的实例，因想把法律相关的表和收藏的表放在同一个数据库里，因此这里就不再新建 Room 的数据库对象类
5. 定义迁移路径
6. 更新数据库实例
7. 验证数据查看结果

由于迁移数据，只会再首次打开或首次更新后才做数据 SQLite 数据迁移到 Room，因此需要对应用数据迁移的触发机制做好处理

### 数据填充

适用于应用没有历史 Room 数据库，使用 SQLite 数据全量填充 Room 数据库

<https://developer.android.google.cn/training/data-storage/room/prepopulate#from-asset>

```java
static synchronized AppDatabase getInstance(Context context) {
    if (INSTANCE == null) {
        INSTANCE = Room.databaseBuilder(context.getApplicationContext(), AppDatabase.class, "lawre_room")
               .createFromAsset("database/db.sqlite3")
                // sql log
//               .setJournalMode(JournalMode.TRUNCATE)
                // 破坏式迁移
//               .fallbackToDestructiveMigration()
                // 迁移策略
//               .addMigrations(MIGRATION1_2)
                .build();
    }
    return INSTANCE;
}
```

### 执行 SQL 输出

在开发过程中，我们有时需要输出当前执行的操作和预期的 SQL 语句是否一致

## ScrollingActivity

文章详情使用了 ScrollingActivity 作为基础布局，它是 Android Studio 提供的一个模版化的 CoordinatorLayout 组合 Activity，这里使用遇到了以下两个问题

1. 不同文章的标题长度不一样，在页面中如何动态调整显示的字数
2. 配合目录进行定位文章内容时，滚动的效果

### 动态标题

### 滚动指定位置

[纠正：Android RecyclerView滚动到指定位置并置顶（滚动方法、移动置顶、定位滑动到指定位置item）](https://blog.csdn.net/weimingjue/article/details/82805361)
[RecyclerView滚动到指定位置的一种姿势。](https://juejin.cn/post/6844904143560114189)

[RecyclerView 滑动到指定位置的终极方案](http://www.javashuo.com/article/p-vjubcjrs-ha.html)
[Android RecyclerView滚动到指定位置并且置顶方案](https://blog.csdn.net/HHHceo/article/details/119946385)
[RecyclerView滚动到指定位置](https://www.jianshu.com/p/6d5ecfdbb615)

## 动态文本生成图片

生成图片时，主要需要考虑

1. 如何自定义 View，且根据内容自适应样式
2. 如何快速生成图片，避免应用无响应卡死
3. 如何生成高质量图片文件，且不会超过应用限制

[Android StaticLayout实现主流便签内容生成长图功能](https://blog.csdn.net/xuqiqiang1993/article/details/67636165)
[Android 仿各主流便签内容生成长图功能](https://blog.csdn.net/u013278940/article/details/52193022)
[Android 根据View生成图片简易参考](https://www.jianshu.com/p/44cc5f3f8de0)

## 更新数据源

在 1.1 版本的开发过程中，开始使用 submodule 方式来依赖数据源，由于是离线应用，如果数据源更新后，必须得更新应用才能看到新的内容，个人觉得频繁的更新整个应用是不太友好，因此我的方案是做一个自动更新开关

1. 开启自动更新，则有新版本，就全量更新整个应用
2. 关闭自动更新，则用户可以自行导入数据源文件，只进行更新应用的数据

[如何直接下载 Github 上的某个文件](https://www.jianshu.com/p/622f479ac132)

[sqlite中的限制：数据库大小、表数、列数、行数、参数个数、连接数等](https://blog.csdn.net/u010168781/article/details/103291193)
[sqlite3数据库最大可以是多大？可以存放多少数据？读写性能怎么样？](https://blog.csdn.net/libaineu2004/article/details/108815466)
[SQLite学习八、TEXT类型读取超过2M的字符串](https://www.jianshu.com/p/30b18212df8d)

### macOS 下 Python 路径问题

[为什么 macOS 在 /usr/bin/ 下会有 python3?](https://www.zhihu.com/question/420273182)

## Github Action

```yaml
name: Android CI

on: [push]

jobs:
  build:

    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v1
      - name: set up JDK 1.11
        uses: actions/setup-java@v1
        with:
          java-version: 1.11
      - name: Build with Gradle
        run: ./gradlew build check
```

## Contribution

[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
[优雅的提交你的 Git Commit Message](https://juejin.cn/post/6844903606815064077)

## 参考

1. [RecyclerView 滑动到指定位置的终极方案](https://blog.csdn.net/u011974987/article/details/80839758)
2. [RecyclerView 滑动到指定位置，并置顶](https://www.cnblogs.com/qynprime/p/9284841.html)
3. [利用 CollapsingToolbarLayout 完成联动的动画效果](https://blog.csdn.net/u012045061/article/details/69568807)
4. [CoordinatorLayout与CollapsingToolbarLayout实现视差滚动动画和Toolbar滚动](https://blog.csdn.net/a8341025123/article/details/53006865)
5. [CoordinatorLayout实现页面滚动动画效果](https://blog.csdn.net/fanhenghao/article/details/105201110)
6. [Github Actions 使用指南和Android 持续集成示例](https://blog.csdn.net/xx326664162/article/details/103921480)
7. [Database Inspector](https://medium.com/androiddevelopers/database-inspector-9e91aa265316)
8. [从 SQLite 逐步迁移到 Room](https://juejin.cn/post/6844903582727143438)
