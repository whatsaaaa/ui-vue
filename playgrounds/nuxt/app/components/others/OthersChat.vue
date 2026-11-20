<script setup lang="ts">
const messages = [
  {
    id: '1',
    role: 'user' as const,
    parts: [{ type: 'text' as const, text: 'How many seats are left?' }],
  },
  {
    id: '2',
    role: 'assistant' as const,
    parts: [{ type: 'text' as const, text: 'Sixteen seats are left for all three days.' }],
  },
]

const question = ref('')
</script>

<template>
  <OthersSample name="UChatAttachment">
    <UChatAttachment name="ticket.pdf" type="application/pdf" description="184 kB" removable />
    <UChatAttachment
      name="program.png"
      type="image/png"
      description="Uploading"
      status="uploading"
    />
  </OthersSample>

  <OthersSample name="UChatMessage">
    <div class="flex w-full max-w-xl flex-col gap-4">
      <UChatMessage
        id="question"
        role="user"
        side="right"
        variant="soft"
        :parts="[{ type: 'text', text: 'Is lunch included?' }]"
      />
      <UChatMessage
        id="answer"
        role="assistant"
        :parts="[{ type: 'text', text: 'Yes, on all three days.' }]"
        :actions="[{ label: 'Copy', icon: 'i-lucide-copy' }]"
      />
    </div>
  </OthersSample>

  <OthersSample name="UChatMessages">
    <UChatMessages
      :messages="messages"
      status="ready"
      :should-auto-scroll="false"
      :should-scroll-to-bottom="false"
      :auto-scroll="false"
      class="w-full max-w-xl"
    />
  </OthersSample>

  <OthersSample name="UChatPalette">
    <div class="h-72 w-full max-w-xl rounded-lg border-thin border-border">
      <UChatPalette>
        <UChatMessages
          :messages="messages"
          status="ready"
          :should-auto-scroll="false"
          :should-scroll-to-bottom="false"
          :auto-scroll="false"
        />
        <template #prompt>
          <UChatPrompt placeholder="Ask about the conference" variant="naked" />
        </template>
      </UChatPalette>
    </div>
  </OthersSample>

  <OthersSample name="UChatPrompt" :with="['UChatPromptSubmit']">
    <UChatPrompt v-model="question" placeholder="Ask about the conference" class="max-w-xl">
      <UChatPromptSubmit />
    </UChatPrompt>
  </OthersSample>

  <OthersSample name="UChatReasoning">
    <UChatReasoning
      text="Counting the paid registrations against forty seats."
      :duration="3"
      class="w-full max-w-xl"
    />
  </OthersSample>

  <OthersSample name="UChatShimmer">
    <UChatShimmer text="Reading the registrations" />
  </OthersSample>

  <OthersSample name="UChatTool">
    <UChatTool
      text="Read the registrations"
      suffix="24 rows"
      icon="i-lucide-database"
      class="w-full max-w-xl"
    />
  </OthersSample>
</template>
