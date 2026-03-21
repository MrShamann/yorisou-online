# Yorisou Deployment Verification

## Live source of truth

Production is verified from the live HTML, not from local build success alone.

Check these routes after every production push:

- `/`
- `/ai-advisor`
- `/products`
- `/login`
- `/register`
- `/support`
- `/insights`

## Release marker

The app layout renders a hidden release marker:

- selector: `#yorisou-release`
- attribute: `data-release`

The value comes from `deploy-trigger.txt`.

## Verification procedure

1. Confirm the expected marker in the repo:

```bash
cat deploy-trigger.txt
```

2. Fetch the live homepage and read the marker:

```bash
curl -L https://yorisou.online | rg 'id=\"yorisou-release\"|data-release'
```

3. Verify key live strings on the main product routes:

```bash
curl -L https://yorisou.online | rg '相談する|製品を見る|ログイン'
curl -L https://yorisou.online/ai-advisor | rg 'まずは話してみましょう'
curl -L https://yorisou.online/support | rg '相談履歴|ご提案内容|ご家族共有|継続相談|フォローアップ'
curl -L https://yorisou.online/products | rg '製品を見る|相談する'
```

4. Compare the live marker with the local `deploy-trigger.txt` value.

If the marker or strings do not match, production has not promoted the latest artifact yet.

## Notes

- `npm run build` only proves the app can build locally.
- The final proof of deployment is the live marker and live route content.
