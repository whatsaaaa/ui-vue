<script setup lang="ts">
import markOnDark from '~/assets/mark-on-dark.svg'

const install = 'pnpm add @whatsaaaa/ui-vue'
const config = `export default defineNuxtConfig({
  modules: ['@nuxt/ui'],
})`
const styles = `@import '@whatsaaaa/ui-vue/index.css';`
</script>

<template>
  <!--
    Prose as @nuxt/content would draw a page of Markdown, each example as wide as a column of
    text. A code block takes its icon by its file's name from the vscode-icons set: nuxt.config.ts
    lists the ones these draw for the icons' bundle.
  -->
  <OthersSample name="ProseH1" :with="['ProseH2', 'ProseH3', 'ProseH4']">
    <div class="w-full max-w-2xl">
      <ProseH1 id="prose-install">Install</ProseH1>
      <ProseH2 id="prose-on-nuxt">On Nuxt</ProseH2>
      <ProseH3 id="prose-the-stylesheet">The stylesheet</ProseH3>
      <ProseH4 id="prose-the-order">The order of its layers</ProseH4>
    </div>
  </OthersSample>

  <OthersSample
    name="ProseP"
    :with="['ProseA', 'ProseStrong', 'ProseEm', 'ProseCode', 'ProseKbd', 'ProseIcon', 'ProseBadge']"
  >
    <div class="w-full max-w-2xl">
      <ProseP>
        Add the package with <ProseCode>pnpm add @whatsaaaa/ui-vue</ProseCode>, then read
        <ProseA href="#prose">the guide</ProseA>. The stylesheet is imported
        <ProseStrong>alone</ProseStrong> and <ProseEm>first</ProseEm>. Press
        <ProseKbd value="meta" /> <ProseKbd value="K" /> to search, or look for the
        <ProseIcon name="i-lucide-search" /> icon. <ProseBadge>New</ProseBadge>
      </ProseP>
    </div>
  </OthersSample>

  <OthersSample name="ProseUl" :with="['ProseOl', 'ProseLi']">
    <div class="w-full max-w-2xl">
      <ProseUl>
        <ProseLi>Import the stylesheet alone.</ProseLi>
        <ProseLi>Pass the theme to the module.</ProseLi>
      </ProseUl>
      <ProseOl>
        <ProseLi>Install the package.</ProseLi>
        <ProseLi>Start the app.</ProseLi>
      </ProseOl>
    </div>
  </OthersSample>

  <OthersSample name="ProseBlockquote">
    <div class="w-full max-w-2xl">
      <ProseBlockquote>Borders, not shadows.</ProseBlockquote>
    </div>
  </OthersSample>

  <OthersSample name="ProseHr">
    <div class="w-full max-w-2xl">
      <ProseHr />
    </div>
  </OthersSample>

  <OthersSample name="ProseCallout">
    <div class="w-full max-w-2xl">
      <ProseCallout icon="i-lucide-square-play" to="#prose">
        See the gallery for every variant.
      </ProseCallout>
    </div>
  </OthersSample>

  <OthersSample name="ProseNote">
    <div class="w-full max-w-2xl">
      <ProseNote>The tokens follow the class the color mode sets.</ProseNote>
    </div>
  </OthersSample>

  <OthersSample name="ProseTip">
    <div class="w-full max-w-2xl">
      <ProseTip>A page can keep one theme with definePageMeta.</ProseTip>
    </div>
  </OthersSample>

  <OthersSample name="ProseWarning">
    <div class="w-full max-w-2xl">
      <ProseWarning>Do not call setTheme in an app on Nuxt UI.</ProseWarning>
    </div>
  </OthersSample>

  <OthersSample name="ProseCaution">
    <div class="w-full max-w-2xl">
      <ProseCaution>Removing the head script lets the wrong theme flash.</ProseCaution>
    </div>
  </OthersSample>

  <OthersSample name="ProseCard" :with="['ProseCardGroup']">
    <div class="w-full max-w-2xl">
      <ProseCardGroup>
        <ProseCard title="Install" icon="i-lucide-download" to="#prose">
          Add the package to an app.
        </ProseCard>
        <ProseCard title="Theme" icon="i-lucide-palette" to="#prose">
          Dark, light and parts in one theme.
        </ProseCard>
      </ProseCardGroup>
    </div>
  </OthersSample>

  <OthersSample name="ProseAccordion" :with="['ProseAccordionItem']">
    <div class="w-full max-w-2xl">
      <ProseAccordion>
        <ProseAccordionItem label="Does it need Nuxt?">
          <ProseP>No. It works on Vue with Vite too.</ProseP>
        </ProseAccordionItem>
        <ProseAccordionItem label="Does it bring fonts?">
          <ProseP>Yes, the design system's, self-hosted.</ProseP>
        </ProseAccordionItem>
      </ProseAccordion>
    </div>
  </OthersSample>

  <OthersSample name="ProseTabs" :with="['ProseTabsItem']">
    <div class="w-full max-w-2xl">
      <ProseTabs>
        <ProseTabsItem label="Nuxt">
          <ProseP>Pass the theme to the module in nuxt.config.ts.</ProseP>
        </ProseTabsItem>
        <ProseTabsItem label="Vue">
          <ProseP>Pass the theme to the Vite plugin.</ProseP>
        </ProseTabsItem>
      </ProseTabs>
    </div>
  </OthersSample>

  <OthersSample name="ProseCollapsible">
    <div class="w-full max-w-2xl">
      <ProseCollapsible name="the options">
        <ProseP>The module takes a theme and a list of colors.</ProseP>
      </ProseCollapsible>
    </div>
  </OthersSample>

  <OthersSample name="ProseField" :with="['ProseFieldGroup']">
    <div class="w-full max-w-2xl">
      <ProseFieldGroup>
        <ProseField name="theme" type="object" required>The module's theme options.</ProseField>
        <ProseField name="fonts" type="boolean">Whether Nuxt UI fetches fonts.</ProseField>
      </ProseFieldGroup>
    </div>
  </OthersSample>

  <OthersSample name="ProseSteps">
    <div class="w-full max-w-2xl">
      <ProseSteps level="3">
        <ProseH3 id="prose-step-install">Install the package</ProseH3>
        <ProseP>With the package manager of the app.</ProseP>
        <ProseH3 id="prose-step-import">Import the stylesheet</ProseH3>
        <ProseP>Alone, and before the app's own rules.</ProseP>
      </ProseSteps>
    </div>
  </OthersSample>

  <OthersSample name="ProseImg">
    <div class="w-full max-w-2xl">
      <ProseImg :src="markOnDark" alt="The mark of ui-vue" width="96" height="96" :zoom="false" />
    </div>
  </OthersSample>

  <OthersSample name="ProsePre">
    <div class="w-full max-w-2xl">
      <ProsePre :code="install" language="sh" filename="Terminal" icon="i-lucide-terminal"
        ><code>{{ install }}</code></ProsePre
      >
    </div>
  </OthersSample>

  <OthersSample name="ProseCodeIcon">
    <ProseCodeIcon filename="nuxt.config.ts" class="size-icon-lg" />
    <ProseCodeIcon filename="main.css" class="size-icon-lg" />
    <ProseCodeIcon icon="i-lucide-terminal" class="size-icon-lg" />
  </OthersSample>

  <OthersSample name="ProseCodeGroup">
    <div class="w-full max-w-2xl">
      <ProseCodeGroup>
        <ProsePre :code="config" language="ts" filename="nuxt.config.ts"
          ><code>{{ config }}</code></ProsePre
        >
        <ProsePre :code="styles" language="css" filename="main.css"
          ><code>{{ styles }}</code></ProsePre
        >
      </ProseCodeGroup>
    </div>
  </OthersSample>

  <OthersSample name="ProseCodeCollapse">
    <div class="w-full max-w-2xl">
      <ProseCodeCollapse name="the config">
        <ProsePre :code="config" language="ts" filename="nuxt.config.ts"
          ><code>{{ config }}</code></ProsePre
        >
      </ProseCodeCollapse>
    </div>
  </OthersSample>

  <OthersSample name="ProseCodePreview">
    <div class="w-full max-w-2xl">
      <ProseCodePreview>
        <UButton label="Register" />
        <template #code>
          <ProsePre code='<UButton label="Register" />' language="vue"
            ><code>&lt;UButton label="Register" /&gt;</code></ProsePre
          >
        </template>
      </ProseCodePreview>
    </div>
  </OthersSample>

  <OthersSample name="ProseCodeTree">
    <div class="w-full max-w-2xl">
      <ProseCodeTree default-value="nuxt.config.ts" expand-all>
        <ProsePre :code="config" language="ts" filename="nuxt.config.ts"
          ><code>{{ config }}</code></ProsePre
        >
        <ProsePre :code="styles" language="css" filename="app/assets/css/main.css"
          ><code>{{ styles }}</code></ProsePre
        >
      </ProseCodeTree>
    </div>
  </OthersSample>

  <OthersSample name="ProsePrompt">
    <div class="w-full max-w-2xl">
      <ProsePrompt
        description="Add ui-vue to this Nuxt app"
        prompt="Add @whatsaaaa/ui-vue to this Nuxt app, as its README shows."
        icon="i-lucide-sparkles"
        :actions="['copy']"
      />
    </div>
  </OthersSample>

  <OthersSample
    name="ProseTable"
    :with="['ProseThead', 'ProseTbody', 'ProseTr', 'ProseTh', 'ProseTd']"
  >
    <div class="w-full max-w-2xl">
      <ProseTable>
        <ProseThead>
          <ProseTr>
            <ProseTh>Token</ProseTh>
            <ProseTh>Value</ProseTh>
          </ProseTr>
        </ProseThead>
        <ProseTbody>
          <ProseTr>
            <ProseTd>control.height.md</ProseTd>
            <ProseTd>40px</ProseTd>
          </ProseTr>
          <ProseTr>
            <ProseTd>radius.sm</ProseTd>
            <ProseTd>4px</ProseTd>
          </ProseTr>
        </ProseTbody>
      </ProseTable>
    </div>
  </OthersSample>
</template>
