<template>
  <div>
    <div 
    class="bg-white shadow-md border border-gray-300 mb-4"
    v-if="editor">
      <v-btn title="deshacer" icon @click="editor.chain().focus().undo().run()">
        <v-icon>mdi-reply</v-icon> 
      </v-btn>

      <v-btn title="rehacer" icon @click="editor.chain().focus().redo().run()">
        <v-icon>mdi-share</v-icon> 
      </v-btn>


      <v-btn icon @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
        <v-icon>mdi-format-bold </v-icon>
      </v-btn>

      <v-btn icon @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
        <v-icon>mdi-format-italic </v-icon>
      </v-btn>

      <v-btn icon @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
        <v-icon>mdi-format-strikethrough</v-icon>
      </v-btn>

      <v-btn icon @click="editor.chain().focus().setHorizontalRule().run()">
        <v-icon>mdi-border-bottom-variant</v-icon> 
      </v-btn>

      <v-btn icon @click="editor.chain().focus().toggleCodeBlock().run()" :class="{ 'is-active': editor.isActive('codeBlock') }">
        <v-icon>mdi-application-braces</v-icon>
      </v-btn>

      <v-btn icon @click="editor.chain().focus().setParagraph().run()" :class="{ 'is-active': editor.isActive('paragraph') }">
        <v-icon>mdi-format-paragraph</v-icon>
      </v-btn>

      <v-btn icon @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
        <v-icon>mdi-format-header-1</v-icon>
      </v-btn>

      <v-btn icon @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
        <v-icon>mdi-format-header-2</v-icon>
      </v-btn>

      <v-btn icon @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
        <v-icon>mdi-format-header-3</v-icon>
      </v-btn>

      <v-btn icon @click="editor.chain().focus().toggleHeading({ level: 4 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }">
        <v-icon>mdi-format-header-4</v-icon>
      </v-btn>

      <v-btn icon @click="editor.chain().focus().toggleHeading({ level: 5 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }">
        <v-icon>mdi-format-header-5</v-icon>
      </v-btn>

      <v-btn icon @click="editor.chain().focus().toggleHeading({ level: 6 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }">
        <v-icon>mdi-format-header-6</v-icon>
      </v-btn>

      <v-btn icon @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }">
        <v-icon>mdi-format-list-bulleted</v-icon>
      </v-btn>

      <v-btn icon @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }">
        <v-icon>mdi-format-list-numbered</v-icon>
      </v-btn>

      <v-btn icon @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }">
        <v-icon>mdi-format-quote-close</v-icon> 
      </v-btn>

      <v-btn icon  @click="addImage">
        <v-icon>mdi-image</v-icon> 
      </v-btn>      
    </div>
    
      <editor-content 
      class="bg-white border border-gray-400 p-6"
      style="height:27rem;"
      :editor="editor" 
      />
  </div>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-2'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'

export default {
  components: {
    EditorContent,
  },

  props: {
    value: {
      type: String,
      default: 'Introduzca el texto aquí',
    },
  },

  data() {
    return {
      editor: null,
    }
  },

  methods:{
    addImage() {
      const url = window.prompt('URL')

      if (url) {
        this.editor.chain().focus().setImage({ src: url }).run()
      }
    },
  },

  watch: {
    value(value) {
      // HTML
      const isSame = this.editor.getHTML() === value

      // JSON
      // const isSame = this.editor.getJSON().toString() === value.toString()

      if (isSame) {
        return
      }

      this.editor.commands.setContent(this.value, false)
    },
  },

  mounted() {
    this.editor = new Editor({
      extensions: [
        StarterKit,
        Image,
      ],
      content: this.value,
      onUpdate: () => {
        // HTML
        this.$emit('editor', this.editor.getHTML())

        // JSON
        // this.$emit('input', this.editor.getJSON())
      },
    })
  },

  beforeDestroy() {
    this.editor.destroy()
  },
}
</script>

  
<style lang="scss">
/* Basic editor styles */
.ProseMirror {
  > * + * {
    margin-top: 0.75em;
  }

  ul {
    list-style-type: square;
    margin-left: 1em;
  }
  ul,
  ol {
    padding: 0 1rem;
  }

  h1 {
    font-weight: bold;
    font-size: 250%;
  }

  h2 {
    font-weight: bold;
    font-size: 200%;
  }

  h3 {
    font-weight: bold;
    font-size: 175%;
  }

  h4, h5, h6 {
    font-weight: bold;
    font-size: 150%;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
  }

  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }

  pre {
    background: #0D0D0D;
    color: #FFF;
    font-family: 'JetBrainsMono', monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }
  }

  img {
    max-width: 100%;
    height: auto;
  }

  blockquote {
    padding-left: 1rem;
    border-left: 2px solid rgba(#0D0D0D, 0.1);
  }

  hr {
    border: none;
    border-top: 2px solid rgba(#0D0D0D, 0.1);
    margin: 2rem 0;
  }
}
</style>