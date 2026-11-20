<script setup lang="ts">
const notes = ref(
  '<h2>Notes</h2><p>The <strong>workshop</strong> starts at nine. Bring a laptop.</p><p>Type / for a block, @ for a person and : for an emoji.</p>',
)

const toolbar = [
  [
    { kind: 'mark' as const, mark: 'bold' as const, icon: 'i-lucide-bold', 'aria-label': 'Bold' },
    {
      kind: 'mark' as const,
      mark: 'italic' as const,
      icon: 'i-lucide-italic',
      'aria-label': 'Italic',
    },
    { kind: 'mark' as const, mark: 'code' as const, icon: 'i-lucide-code', 'aria-label': 'Code' },
  ],
  [
    {
      kind: 'heading' as const,
      level: 2 as const,
      icon: 'i-lucide-heading-2',
      'aria-label': 'Heading',
    },
    { kind: 'bulletList' as const, icon: 'i-lucide-list', 'aria-label': 'List' },
  ],
]

const blocks = [
  [
    { kind: 'heading' as const, level: 2 as const, label: 'Heading', icon: 'i-lucide-heading-2' },
    { kind: 'bulletList' as const, label: 'List', icon: 'i-lucide-list' },
    { kind: 'blockquote' as const, label: 'Quote', icon: 'i-lucide-text-quote' },
  ],
]

const people = [
  { label: 'Milica Jovanović', avatar: { alt: 'Milica Jovanović' } },
  { label: 'Nikola Petrović', avatar: { alt: 'Nikola Petrović' } },
]

const emojis = [
  { name: 'smile', emoji: '😄', shortcodes: ['smile'], tags: ['happy'] },
  { name: 'tada', emoji: '🎉', shortcodes: ['tada'], tags: ['party'] },
]
</script>

<template>
  <OthersSample
    name="UEditor"
    :with="[
      'UEditorToolbar',
      'UEditorDragHandle',
      'UEditorSuggestionMenu',
      'UEditorMentionMenu',
      'UEditorEmojiMenu',
    ]"
  >
    <UEditor
      v-slot="{ editor }"
      v-model="notes"
      content-type="html"
      class="w-full max-w-xl rounded-lg border-thin border-border"
      :ui="{ base: 'px-10 py-4' }"
    >
      <UEditorToolbar :editor="editor" :items="toolbar" class="border-b-thin border-border p-2" />
      <UEditorDragHandle :editor="editor" />
      <UEditorSuggestionMenu :editor="editor" :items="blocks" />
      <UEditorMentionMenu :editor="editor" :items="people" />
      <UEditorEmojiMenu :editor="editor" :items="emojis" />
    </UEditor>
  </OthersSample>
</template>
