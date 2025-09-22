<template>
  <div class="readme-viewer bg-[#0d1117] border border-[#FFB86C] overflow-hidden h-full flex flex-col">

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-16">
      <div class="flex items-center gap-3">
        <div class="w-5 h-5 border-2 border-[#30363d] border-t-[#58a6ff] rounded-full animate-spin"></div>
        <span class="text-[#8b949e] text-sm">Loading README...</span>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="flex items-center justify-center py-16"
    >
      <div class="flex flex-col items-center gap-3 text-center">
        <svg class="w-12 h-12 text-[#f85149]" fill="currentColor" viewBox="0 0 16 16">
          <path d="M2.343 13.657A8 8 0 1 1 13.658 2.343 8 8 0 0 1 2.343 13.657ZM6.03 4.97a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042L6.94 8 4.97 9.97a.749.749 0 0 0 .326 1.275.749.749 0 0 0 .734-.215L8 9.06l1.97 1.97a.749.749 0 0 0 1.275-.326.749.749 0 0 0-.215-.734L9.06 8l1.97-1.97a.749.749 0 0 0-.326-1.275.749.749 0 0 0-.734.215L8 6.94Z"/>
        </svg>
        <div>
          <div class="text-[#f0f6fc] font-medium mb-1">Failed to load README</div>
          <div class="text-[#8b949e] text-sm">{{ error }}</div>
        </div>
      </div>
    </div>

    <!-- No README -->
    <div v-else-if="!readmeContent" class="flex items-center justify-center py-16">
      <div class="flex flex-col items-center gap-3 text-center">
        <svg class="w-12 h-12 text-[#8b949e]" fill="currentColor" viewBox="0 0 16 16">
          <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688l-.011-.013-2.914-2.914-.013-.011Z"/>
        </svg>
        <div>
          <div class="text-[#f0f6fc] font-medium mb-1">No README</div>
          <div class="text-[#8b949e] text-sm">This repository doesn't have a README file</div>
        </div>
      </div>
    </div>

    <!-- Markdown Content -->
    <div
      v-else
      class="markdown-body px-6 overflow-auto flex-1"
      v-html="readmeHtml"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, defineProps } from "vue";
import { marked } from "marked";
import DOMPurify from "dompurify";
// import { githubApi } from "@/services/api"; // Uncomment when using

// Configure marked to match GitHub's rendering
marked.setOptions({
  gfm: true,
  breaks: true,
  // Ensure proper handling of non-ASCII characters
  silent: false
});

const props = defineProps<{
  owner: string;
  repo: string;
}>();

const readmeContent = ref("");
const isLoading = ref(false);
const error = ref("");

const readmeHtml = ref("");

// Function to parse markdown asynchronously
const parseMarkdown = async (content: string) => {
  if (!content) return "";
  
  try {
    const rawHtml = await marked.parse(content);
    // Configure DOMPurify to handle Chinese characters properly
    return DOMPurify.sanitize(rawHtml, {
      ALLOWED_TAGS: [
        "h1", "h2", "h3", "h4", "h5", "h6", "p", "a", "ul", "ol", "li", 
        "blockquote", "pre", "code", "span", "div", "table", "thead", 
        "tbody", "tr", "th", "td", "img", "strong", "em", "del", "hr", 
        "br", "details", "summary", "input", "sup", "sub", "kbd", "mark"
      ],
      ALLOWED_ATTR: [
        "href", "src", "alt", "title", "class", "id", "width", "height", 
        "align", "type", "checked", "disabled", "start", "reversed"
      ],
      // Preserve text content including Chinese characters
      KEEP_CONTENT: true,
      // Allow data attributes that might be used for i18n
      ADD_ATTR: ['data-*'],
      // Preserve text content when sanitizing
      RETURN_DOM: false,
      RETURN_DOM_FRAGMENT: false,
      // Allow HTML entities
      ALLOW_UNKNOWN_PROTOCOLS: true
    });
  } catch (err) {
    console.error("Error parsing markdown:", err);
    return `<pre class="text-[#f85149]">Error parsing markdown: ${err instanceof Error ? err.message : 'Unknown error'}</pre>`;
  }
};

// Watch for content changes and parse markdown
watch(readmeContent, async (newContent) => {
  if (newContent) {
    readmeHtml.value = await parseMarkdown(newContent);
  } else {
    readmeHtml.value = "";
  }
}, { immediate: true });


// Fetch README from backend
const fetchReadme = async () => {
  if (!props.owner || !props.repo) return;

  isLoading.value = true;
  error.value = "";
  readmeContent.value = "";

  try {
    const response = await fetch(`http://localhost:3000/api/v1/repos/${props.owner}/${props.repo}/readme`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("README not found");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get the content type to handle both JSON and plain text responses
    const contentType = response.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      const data = await response.json();
      if (data.content) {
        // If content is base64 encoded (common in GitHub API)
        const content = typeof data.content === 'string' 
          ? atob(data.content.replace(/\s/g, '')) 
          : JSON.stringify(data.content, null, 2);
        readmeContent.value = content;
      } else if (data.data && typeof data.data === 'string') {
        // If content is nested in a data property
        readmeContent.value = data.data;
      } else if (typeof data === 'string') {
        // If the response is a string
        readmeContent.value = data;
      } else {
        // Fallback to stringify the whole response
        readmeContent.value = JSON.stringify(data, null, 2);
      }
    } else {
      // Handle plain text response
      const buffer = await response.arrayBuffer();
      // Use TextDecoder with 'utf-8' to properly handle Chinese characters
      const decoder = new TextDecoder('utf-8');
      readmeContent.value = decoder.decode(buffer);
    }

    if (!readmeContent.value || !readmeContent.value.trim()) {
      throw new Error("README file is empty");
    }
  } catch (err) {
    if (err instanceof Error) {
      error.value = err.message;
    } else {
      error.value = "Failed to load README";
    }
    console.error("Error fetching README:", err);
  } finally {
    isLoading.value = false;
  }
};

// Watch for prop changes
watch([() => props.owner, () => props.repo], () => {
  fetchReadme();
}, { immediate: false });

// Initial fetch
onMounted(() => {
  fetchReadme();
});
</script>

<style>
/* GitHub-accurate markdown styling */
.markdown-body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: #f0f6fc;
  word-wrap: break-word;
}

/* Headers */
.markdown-body h1, 
.markdown-body h2, 
.markdown-body h3, 
.markdown-body h4, 
.markdown-body h5, 
.markdown-body h6 {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
  color: #f0f6fc;
}

.markdown-body h1 {
  font-size: 2em;
  border-bottom: 1px solid #30363d;
  padding-bottom: 0.3em;
}

.markdown-body h2 {
  font-size: 1.5em;
  border-bottom: 1px solid #30363d;
  padding-bottom: 0.3em;
}

.markdown-body h3 {
  font-size: 1.25em;
}

.markdown-body h4 {
  font-size: 1em;
}

.markdown-body h5 {
  font-size: 0.875em;
}

.markdown-body h6 {
  font-size: 0.85em;
  color: #8b949e;
}

/* Paragraphs and text */
.markdown-body p {
  margin-top: 0;
  margin-bottom: 16px;
}

.markdown-body strong {
  font-weight: 600;
}

.markdown-body em {
  font-style: italic;
}

.markdown-body del {
  text-decoration: line-through;
}

/* Links */
.markdown-body a {
  color: #58a6ff;
  text-decoration: none;
}

.markdown-body a:hover {
  text-decoration: underline;
}

/* Code */
.markdown-body code {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  background-color: rgba(110, 118, 129, 0.4);
  border-radius: 6px;
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace;
}

.markdown-body pre {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: #161b22;
  border-radius: 6px;
  margin-bottom: 16px;
}

.markdown-body pre code {
  display: inline;
  max-width: auto;
  padding: 0;
  margin: 0;
  overflow: visible;
  line-height: inherit;
  word-wrap: normal;
  background-color: transparent;
  border: 0;
}

/* Lists */
.markdown-body ul,
.markdown-body ol {
  margin-top: 0;
  margin-bottom: 16px;
  padding-left: 2em;
}

.markdown-body li {
  margin-top: 0.25em;
}

.markdown-body li + li {
  margin-top: 0.25em;
}

/* Blockquotes */
.markdown-body blockquote {
  padding: 0 1em;
  color: #8b949e;
  border-left: 0.25em solid #30363d;
  margin: 0 0 16px 0;
}

.markdown-body blockquote > :first-child {
  margin-top: 0;
}

.markdown-body blockquote > :last-child {
  margin-bottom: 0;
}

/* Tables */
.markdown-body table {
  border-spacing: 0;
  border-collapse: collapse;
  display: block;
  width: max-content;
  max-width: 100%;
  overflow: auto;
  margin-bottom: 16px;
}

.markdown-body table th,
.markdown-body table td {
  padding: 6px 13px;
  border: 1px solid #30363d;
}

.markdown-body table th {
  font-weight: 600;
  background-color: #161b22;
}

.markdown-body table tr {
  background-color: transparent;
  border-top: 1px solid #30363d;
}

.markdown-body table tr:nth-child(2n) {
  background-color: #0d1117;
}

/* Horizontal rule */
.markdown-body hr {
  height: 0.25em;
  padding: 0;
  margin: 24px 0;
  background-color: #30363d;
  border: 0;
}

/* Images */
.markdown-body img {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
}

/* Keyboard keys */
.markdown-body kbd {
  display: inline-block;
  padding: 3px 5px;
  font-size: 11px;
  line-height: 10px;
  color: #f0f6fc;
  vertical-align: middle;
  background-color: #21262d;
  border: solid 1px #30363d;
  border-bottom-color: #484f58;
  border-radius: 6px;
  box-shadow: inset 0 -1px 0 #484f58;
}

/* Details/Summary */
.markdown-body details {
  display: block;
  margin-bottom: 16px;
}

.markdown-body summary {
  display: list-item;
  cursor: pointer;
}

/* Checkboxes */
.markdown-body input[type="checkbox"] {
  margin-right: 8px;
}
</style>