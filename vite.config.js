// 必要な関数、モジュールをインポートする
import { defineConfig } from 'vite';
import path from 'path';
// 画像を圧縮するためのプラグインをインポート
import viteImagemin from 'vite-plugin-imagemin';

// Rollupのオプション設定を取得
const getRollupOptions = (rootDir) => ({
    input: {
        index: path.resolve(__dirname, `${rootDir}/index.html`), // エントリーポイントを設定
    },
    output: {
        assetFileNames: (assetInfo) => {
        let extType = assetInfo.name.split('.').pop();
        if (extType === 'css') {
            return 'css/style.min[extname]'; // CSSファイルの出力先を指定
        } else if (/js/i.test(extType)) {
            return 'js/[name].min[extname]'; // JavaScriptファイルの出力先を指定
        } else if (/png|jpe?g|gif|svg/i.test(extType)) {
            return 'img/[name][extname]'; // 画像ファイルの出力先を指定
        }
        return '[name][extname]';
        },
        entryFileNames: 'js/main.min.js', // エントリーファイルの出力先フォルダを設定
    },
});
// viteの設定をエクスポート
export default defineConfig(() => {

    return {
        root: 'src', // プロジェクトのルートディレクトリを指定
        base: './', // 生成されるファイルのベースパスを相対パスに設定
        build: {
        outDir: path.resolve(__dirname, 'dist'), // ビルドファイルの出力先
        emptyOutDir: true, // 出力先をクリーンにする
        rollupOptions: getRollupOptions('src'), // Rollupのオプション設定を適用
        },
        plugins: [
            // 画像を圧縮するための設定を記載
            viteImagemin({
                gifsicle: {
                    optimizationLevel: 7,
                    interlaced: false,
                },
                optipng: {
                    optimizationLevel: 7,
                },
                mozjpeg: {
                    quality: 20,
                },
                pngquant: {
                    quality: [0.8, 0.9],
                    speed: 4,
                },
                svgo: {
                    plugins: [
                        {
                            name: 'removeViewBox',
                        },
                        {
                            name: 'removeEmptyAttrs',
                            active: false,
                        },
                    ],
                },
            }),
        ],
    };
});
