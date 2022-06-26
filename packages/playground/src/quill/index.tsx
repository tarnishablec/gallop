import Quill from 'quill'

const editor = new Quill('#editor', {
  modules: { toolbar: '#toolbar' },
  theme: 'snow'
})

document.querySelector('#export')?.addEventListener('click', () => {
  console.log(editor.getContents())
})
