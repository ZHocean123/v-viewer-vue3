<template>
  <div ref="elRef">
    <slot :images="images" :options="options"> </slot>
  </div>
</template>
<script lang="ts">
import Viewer from "viewerjs";
import {
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue-demi";

export default defineComponent({
  props: {
    images: {
      type: Array,
    },
    rebuild: {
      type: Boolean,
      default: false,
    },
    trigger: {},
    options: {
      type: Object,
    },
  },
  setup(props, ctx) {
    const elRef = ref<HTMLElement | undefined>(undefined);
    const $viewer = ref<Viewer | undefined>(undefined);

    function destroyViewer() {
      $viewer.value?.destroy();
    }

    function createViewer() {
      const $el = elRef.value;
      if ($el) {
        $viewer.value = new Viewer($el, props.options);
      }
    }

    function updateViewer() {
      if ($viewer.value) {
        $viewer.value.update();
        ctx.emit("inited", $viewer.value);
      } else {
        createViewer();
      }
    }

    function rebuildViewer() {
      destroyViewer();
      createViewer();
    }

    function onChange() {
      if (props.rebuild) {
        rebuildViewer();
      } else {
        updateViewer();
      }
    }

    watch(
      () => props.images,
      () => nextTick(onChange)
    );

    watch(
      () => props.trigger,
      () => nextTick(onChange),
      { deep: true }
    );

    watch(
      () => props.options,
      () => rebuildViewer(),
      { deep: true }
    );

    onMounted(() => createViewer());
    onBeforeUnmount(() => destroyViewer());

    return {
      elRef,
    };
  },
});
</script>
