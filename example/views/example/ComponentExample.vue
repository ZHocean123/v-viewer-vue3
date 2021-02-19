<template>
  <div>
    <div class="methods is-flex">
      <div class="field has-addons">
        <p class="control">
          <button
            type="button"
            class="button is-primary"
            @click="toggleInline(false)"
            :class="{ ' is-active': !options.inline }"
          >
            Modal
          </button>
        </p>
        <p class="control">
          <button
            type="button"
            class="button is-primary"
            @click="toggleInline(true)"
            :class="{ ' is-active': options.inline }"
          >
            Inline
          </button>
        </p>
      </div>
      <button
        type="button"
        class="button"
        @click="add"
        :disabled="images.length === 9"
      >
        Add
      </button>
      <button
        type="button"
        class="button"
        @click="remove"
        :disabled="images.length === 1"
      >
        Remove
      </button>
      <template v-if="options.inline">
        <div class="field has-addons" style="width: 110px">
          <div class="control">
            <span class="button is-static">View</span>
          </div>
          <div class="control">
            <input
              class="input"
              type="text"
              v-model.number="form.view"
              @keyup="view"
            />
          </div>
        </div>
        <div class="field has-addons" style="width: 120px">
          <div class="control">
            <input class="input" type="text" v-model.number="form.zoom" />
          </div>
          <div class="control">
            <span class="button" @click="zoom()">Zoom</span>
          </div>
        </div>
        <div class="field has-addons" style="width: 140px">
          <div class="control">
            <input class="input" type="text" v-model.number="form.zoomTo" />
          </div>
          <div class="control">
            <span class="button" @click="zoomTo">Zoom to</span>
          </div>
        </div>
        <div class="field has-addons" style="width: 120px">
          <div class="control">
            <input class="input" type="text" v-model.number="form.rotate" />
          </div>
          <div class="control">
            <span class="button" @click="rotate()">Rotate</span>
          </div>
        </div>
        <div class="field has-addons" style="width: 140px">
          <div class="control">
            <input class="input" type="text" v-model.number="form.rotateTo" />
          </div>
          <div class="control">
            <span class="button" @click="rotateTo">Rotate to</span>
          </div>
        </div>
        <div class="field has-addons">
          <div class="control">
            <button type="button" class="button" @click="zoom(0.5)">
              Zoom In
            </button>
          </div>
          <div class="control">
            <button type="button" class="button" @click="zoom(-0.5)">
              Zoom Out
            </button>
          </div>
        </div>
        <div class="field has-addons">
          <div class="control">
            <button type="button" class="button" @click="rotate(-90)">
              Rotate Left
            </button>
          </div>
          <div class="control">
            <button type="button" class="button" @click="rotate(90)">
              Rotate Right
            </button>
          </div>
        </div>
        <div class="field has-addons">
          <div class="control">
            <button type="button" class="button" @click="scaleX()">
              Flip Horizontal
            </button>
          </div>
          <div class="control">
            <button type="button" class="button" @click="scaleY()">
              Flip Vertical
            </button>
          </div>
        </div>
        <div class="field has-addons">
          <div class="control">
            <button type="button" class="button" @click="move(-10, 0)">
              Left
            </button>
          </div>
          <div class="control">
            <button type="button" class="button" @click="move(10, 0)">
              Right
            </button>
          </div>
          <div class="control">
            <button type="button" class="button" @click="move(0, -10)">
              Up
            </button>
          </div>
          <div class="control">
            <button type="button" class="button" @click="move(0, 10)">
              Down
            </button>
          </div>
        </div>
        <div class="field has-addons">
          <div class="control">
            <button type="button" class="button" @click="prev">Prev</button>
          </div>
          <div class="control">
            <button type="button" class="button" @click="next">Next</button>
          </div>
          <div class="control">
            <button type="button" class="button" @click="play">Play</button>
          </div>
          <div class="control">
            <button type="button" class="button" @click="stop">Stop</button>
          </div>
        </div>
        <button type="button" class="button" @click="full">Full</button>
        <button type="button" class="button" @click="tooltip">Tooltip</button>
        <button type="button" class="button" @click="reset">Reset</button>
      </template>
      <template v-else>
        <button type="button" class="button" @click="show">Show</button>
      </template>
    </div>
    <div class="tile is-ancestor">
      <div class="tile is-2 is-vertical is-parent">
        <div class="tile is-child">
          <nav class="panel options-panel">
            <p class="panel-heading">Options</p>
            <div class="panel-block" v-for="item of toggleOptions" :key="item">
              <label class="checkbox">
                <input type="checkbox" name="button" v-model="options[item]" />
                {{ item }}
              </label>
            </div>
          </nav>
        </div>
      </div>
      <div class="tile is-10 is-vertical is-parent">
        <div class="viewer-wrapper">
          <viewer
            :options="options"
            :images="images"
            @inited="inited"
            class="viewer"
            ref="viewer"
          >
            <template #default="scope">
              <figure class="images">
                <div
                  class="image-wrapper"
                  v-for="{ source, thumbnail } in scope.images"
                  :key="source"
                >
                  <img
                    class="image"
                    :src="thumbnail"
                    :data-source="source"
                    :alt="source.split('?image=').pop()"
                  />
                </div>
              </figure>
              <p><strong>Options: </strong>{{ scope.options }}</p>
            </template>
          </viewer>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import "viewerjs/dist/viewer.css";
import { defineComponent, getCurrentInstance, reactive, ref } from "vue";
import Viewer from "../../../src/index";

const sourceImages: { thumbnail: string; source: string }[] = [];
const base = parseInt(Math.random() * 60 + "", 10) + 10;
for (let i = 0; i < 10; i++) {
  sourceImages.push({
    thumbnail: `https://picsum.photos/id/${base + i}/346/216`,
    source: `https://picsum.photos/id/${base + i}/1440/900`,
  });
}

export default defineComponent({
  setup() {
    getCurrentInstance()?.appContext.app?.use(Viewer);
    Viewer.setDefaults({
      zIndexInline: 2017,
    });

    const form = reactive({
      view: 2,
      zoom: -0.1,
      zoomTo: 0.8,
      rotate: 90,
      rotateTo: 180,
      scaleX: 1,
      scaleY: 1,
    });
    const toggleOptions = [
      "button",
      "navbar",
      "title",
      "toolbar",
      "tooltip",
      "movable",
      "zoomable",
      "rotatable",
      "scalable",
      "transition",
      "fullscreen",
      "keyboard",
    ];
    const options = reactive({
      inline: true,
      button: true,
      navbar: true,
      title: true,
      toolbar: true,
      tooltip: true,
      movable: true,
      zoomable: true,
      rotatable: true,
      scalable: true,
      transition: true,
      fullscreen: true,
      keyboard: true,
      url: "data-source",
    });

    const images = ref([...sourceImages].splice(0, 5));

    const $viewer = ref<Viewer | undefined>(undefined);

    function inited(viewer: Viewer) {
      $viewer.value = viewer;
    }
    function add() {
      images.value.push(sourceImages[images.value.length]);
    }
    function remove() {
      images.value.pop();
    }
    function view() {
      if (form.view >= 0 && form.view < images.value.length) {
        $viewer.value?.view(form.view);
      }
    }
    function zoom(value: number) {
      $viewer.value?.zoom(value || form.zoom);
    }
    function zoomTo() {
      $viewer.value?.zoomTo(form.zoomTo);
    }
    function rotate(value: number) {
      $viewer.value?.rotate(value || form.rotate);
    }
    function rotateTo() {
      $viewer.value?.rotateTo(form.rotateTo);
    }
    function scaleX(value: number) {
      if (value) {
        $viewer.value?.scaleX(value);
      } else {
        form.scaleX = -form.scaleX;
        $viewer.value?.scaleX(form.scaleX);
      }
    }
    function scaleY(value: number) {
      if (value) {
        $viewer.value?.scaleY(value);
      } else {
        form.scaleY = -form.scaleY;
        $viewer.value?.scaleY(form.scaleY);
      }
    }
    function move(x: number, y: number) {
      $viewer.value?.move(x, y);
    }
    function prev() {
      $viewer.value?.prev();
    }
    function next() {
      $viewer.value?.next();
    }
    function play() {
      $viewer.value?.play();
    }
    function stop() {
      $viewer.value?.stop();
    }
    function show() {
      $viewer.value?.show();
    }
    function full() {
      $viewer.value?.full();
    }
    function tooltip() {
      $viewer.value?.tooltip();
    }
    function reset() {
      $viewer.value?.reset();
    }
    function toggleInline(inline: boolean) {
      options.inline = inline;
    }

    return {
      form,
      toggleOptions,
      options,
      images,
      inited,
      add,
      remove,
      view,
      zoom,
      zoomTo,
      rotate,
      rotateTo,
      scaleX,
      scaleY,
      move,
      prev,
      next,
      play,
      stop,
      show,
      full,
      tooltip,
      reset,
      toggleInline,
    };
  },
});
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.viewer-wrapper {
  position: relative;
  background: #333;
  height: 100%;
}

.methods {
  margin-bottom: 1em;
  flex-wrap: wrap;

  & > * {
    margin-right: 0.75rem;
  }
}

.options-panel {
  .panel-block {
    padding: 0;

    .checkbox {
      display: block;
      width: 100%;
      margin: 0;
      padding: 0.5em 0.75em;
    }
  }
}

.viewer {
  height: 100%;

  .images {
    height: 100%;
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    flex-wrap: wrap;
    padding: 5px;

    .image-wrapper {
      display: inline-block;
      width: calc(33% - 20px);
      margin: 5px 5px 0 5px;

      .image {
        width: 100%;
        cursor: pointer;
        display: inline-block;
      }
    }
  }
}
</style>
