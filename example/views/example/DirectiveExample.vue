<template>
  <div ref="elRef">
    <div class="field is-grouped is-grouped-multiline">
      <p class="control">
        <button
          type="button"
          class="button"
          @click="add"
          :disabled="images.length === 10"
        >
          Add
        </button>
      </p>
      <p class="control">
        <button
          type="button"
          class="button"
          @click="remove"
          :disabled="images.length === 0"
        >
          Remove
        </button>
      </p>
      <p class="control">
        <button type="button" class="button" @click="show">Show</button>
      </p>
      <div class="field has-addons">
        <p class="control">
          <button
            type="button"
            class="button is-primary"
            @click="toggleToolbar(true)"
            :class="{ ' is-active': options.toolbar }"
          >
            Show Toolbar
          </button>
        </p>
        <p class="control">
          <button
            type="button"
            class="button is-primary"
            @click="toggleToolbar(false)"
            :class="{ ' is-active': !options.toolbar }"
          >
            Hide Toolbar
          </button>
        </p>
      </div>
    </div>
    <p>To show the viewer, you can click these images too.</p>
    <div v-viewer="options" class="images clearfix">
      <template v-for="{ source, thumbnail } in images" :key="source">
        <img
          :src="thumbnail"
          :data-source="source"
          class="image"
          :alt="source.split('?image=').pop()"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import "viewerjs/dist/viewer.css";
import VViewer from "../../../src";
import { defineComponent, getCurrentInstance, reactive, ref } from "vue-demi";
import Viewer from "viewerjs";

const sourceImages: { thumbnail: string; source: string }[] = [];
const base = parseInt(Math.random() * 60 + "", 10) + 10;
for (let i = 0; i < 10; i++) {
  sourceImages.push({
    thumbnail: `https://picsum.photos/id/${base + i}/346/216`,
    source: `https://picsum.photos/id/${base + i}/1440/900`,
  });
}

export default defineComponent({
  setup(props, ctx) {
    getCurrentInstance()?.appContext.app?.use(VViewer);
    VViewer.setDefaults({
      zIndexInline: 2017,
    });

    const images = ref([...sourceImages].splice(0, 5));
    const options = reactive({
      toolbar: true,
      url: "data-source",
    });

    function toggleToolbar(toolbar: boolean) {
      // this.options = Object.assign({}, this.options, {toolbar})
      options.toolbar = toolbar;
    }
    function add() {
      images.value.push(sourceImages[images.value.length]);
    }
    function remove() {
      images.value.pop();
    }

    const elRef = ref<any | undefined>(undefined);
    function show() {
      const viewer: Viewer | undefined = elRef.value?.querySelector(".images")
        ?.$viewer;
      viewer?.show();
    }

    return {
      images,
      options,
      toggleToolbar,
      add,
      remove,
      show,
    };
  },
});
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.image {
  width: calc(20% - 10px);
  cursor: pointer;
  margin: 5px;
  display: inline-block;
}
</style>
