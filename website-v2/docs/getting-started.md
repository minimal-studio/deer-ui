---
title: Getting Started
---

## Step 1: Generate a new Docusaurus site

If you haven't already, generate a new Docusaurus site using the classic template:

```shell
npx @docusaurus/init@latest init my-website classic
```

```tsx live
function MyPlayground(props) {
  const ButtonExample2 = (props) => {
    return (
      <button
        {...props}
        style={{
          backgroundColor: 'white',
          border: 'solid red',
          borderRadius: 20,
          padding: 10,
          cursor: 'pointer',
          ...props.style,
        }}
      />
    )
  }
  return (
    <div>
      <ButtonExample2 onClick={() => alert('hey!')}>Click me</ButtonExample2>
    </div>
  );
}
```

## Step 2: Start your Docusaurus site

Run the development server in the newly created `my-website` folder:

```shell
cd my-website

npx docusaurus start
```

Open `docs/getting-started.md` and edit some lines. The site reloads automatically and display your changes.

## That's it!

Congratulations! You've successfully run and modified your Docusaurus project.
