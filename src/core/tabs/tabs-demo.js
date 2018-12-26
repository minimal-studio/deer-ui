export default [...Array(10)].map((_, idx) => ({
  label: '切换到内容' + (idx + 1),
  children: '内容' + (idx + 1)
}));