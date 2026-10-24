# パイプオルガン機構図鑑

パイプオルガンの機構（送風・風箱・キーアクション・ストップアクション・カプラー・総合モデル）を、
3D で動かしながら見られる図鑑です。日本語・英語・ドイツ語・フランス語・オランダ語に対応しています。

## フォルダの中身

| 場所 | 内容 |
|---|---|
| `src/` | 図鑑の元になるファイル。ページの枠（`head.html`・`style.css`・`body.html`）と、プログラム（`js/`）、翻訳（`i18n/strings.json`） |
| `src/js/` | プログラムを機能・モデルごとに分けたもの。ファイル名の番号順につなげて1つのページになります |
| `vendor/` | 3D 表示に使うライブラリ Three.js（r147）の写し |
| `build.mjs` | `src/` を組み立てて `dist/` にページを作るスクリプト |
| `dist/` | 組み立てたページ（`index.html` がウェブサイト用、`artifact.html` が Claude のアーティファクト用）。自動で作り直されます |
| `tests/` | 全モデルの読み込み確認、スクリーンショット、翻訳漏れの確認 |
| `CLAUDE.md` | Claude Code 向けの説明（作りの決まりごと・テストの方法） |

## 最初に一度だけ：変更履歴（Git）の復元

このフォルダには、これまでの版（v3〜v68）の変更履歴が `organ-atlas-history.bundle` という1つのファイルにまとめて入っています。
Claude Code でこのフォルダを開き、「organ-atlas-history.bundle から Git の履歴を復元して」と頼めば復元されます。
自分で行う場合は、Git for Windows を入れたうえで、このフォルダで次を実行します。

```
git init -b main
git fetch organ-atlas-history.bundle main
git reset FETCH_HEAD
git status        # 何も変更がなければ成功。bundle ファイルは削除してかまいません
```

## 使い方

1. ページを組み立てる：`node build.mjs`
2. 確認する：`dist/index.html` をブラウザで開く
3. テスト（任意）：`python tests/check_all_models.py`

Claude Code では「D-05 のここを変えて」と頼めば、`src/` の該当ファイルを直し、組み立てとテストまで行います。

## 公開（まだ行っていません）

Vercel に静的サイトとして置く想定です。GitHub のリポジトリを Vercel につなぐと、`vercel.json` の設定どおり
`node build.mjs` を実行して `dist/` を公開します。

## ライセンス

- Three.js：MIT ライセンス（`vendor/three-0.147.0/LICENSE`）
- 図鑑の内容：未定（公開前に決める）
