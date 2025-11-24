// layout.js

export const layout = ({ title = "My App", body = "", scripts = "" }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>

  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css" >

</head>
<body>
  <header><h1>${title}</h1></header>
  <main>${body}</main>

  <script type="module">
    import "https://cdn.jsdelivr.net/gh/starfederation/datastar@1.0.0-RC.6/bundles/datastar.js";

  </script>
  ${scripts}
</body>
</html>
`




