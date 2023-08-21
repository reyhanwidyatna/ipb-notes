<template>
  <div class="canvas">
    <canvas
      ref="canvas"
      width="300"
      height="320"
      @touchstart="startDrawing"
      @touchmove="draw"
      @touchend="stopDrawing"
      @touchcancel="stopDrawing"
      @mousedown="startDrawing"
      @mousemove="draw"
      @mouseup="stopDrawing"
      @mouseleave="stopDrawing"
    ></canvas>
    <div class="canvas-action">
      <div class="canvas-color">
        <div
          v-for="color in colors"
          :key="color"
          class="canvas-color-preview"
          :style="{ backgroundColor: color }"
          @click="setDrawingColor(color)"
        ></div>
      </div>
      <div>
        <button class="canvas-reset" @click="resetCanvas">
          Reset
        </button>
        <button class="canvas-save" @click="saveCanvas">
          Simpan
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isDrawing: false,
      context: null,
      currentColor: '#ffff88',
      colors: [
        '#ffff88',
        '#ff32b2',
        '#a9edf1',
        '#74ed4b',
      ]
    };
  },
  mounted() {
    this.context = this.$refs.canvas.getContext('2d');
  },
  methods: {
    startDrawing(event) {
      event.preventDefault();
      this.isDrawing = true;
      const { offsetX, offsetY } = this.getEventCoordinates(event);
      this.context.beginPath();
      this.context.moveTo(offsetX, offsetY);
    },
    draw(event) {
      if (!this.isDrawing) return;
      event.preventDefault();
      const { offsetX, offsetY } = this.getEventCoordinates(event);
      this.context.lineTo(offsetX, offsetY);
      this.context.stroke();
    },
    stopDrawing() {
      this.isDrawing = false;
      this.context.closePath();
    },
    getEventCoordinates(event) {
      const canvasRect = this.$refs.canvas.getBoundingClientRect();
      let clientX, clientY;

      if (event.type.startsWith("touch")) {
        if (event.touches.length > 0) {
          clientX = event.touches[0].clientX;
          clientY = event.touches[0].clientY;
        } else {
          return null;
        }
      } else {
        clientX = event.clientX;
        clientY = event.clientY;
      }

      const offsetX = clientX - canvasRect.left;
      const offsetY = clientY - canvasRect.top;

      return { offsetX, offsetY };
    },
    setDrawingColor(color) {
      this.currentColor = color
      this.$emit('color', color);
    },
    resetCanvas() {
      this.context.clearRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height);
    },
    saveCanvas() {
      const canvas = this.$refs.canvas;
      const context = canvas.getContext('2d');

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const pixelData = imageData.data;

      let hasDrawing = false;

      for (let i = 0; i < pixelData.length; i += 4) {
        const alpha = pixelData[i + 3];
        if (alpha !== 0) {
          hasDrawing = true;
          break;
        }
      }

      if (hasDrawing) {
        const imageDataUrl = canvas.toDataURL('image/png', 1.0);
        this.$emit('create', { url: imageDataUrl, color: this.currentColor });
      } else {
        this.$toasted.show('Gambar Anda masih kosong!!!', {
          position: 'top-center',
          duration: 1500,
          type: 'error'
        })
      }
    },
  },
};
</script>

<style>
.canvas {
  display: flex;
  flex-direction: column;
}

.canvas-action {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: transparent;
  padding: 8px 16px;
  box-sizing: border-box;
}

.canvas-color {
  display: flex;
  gap: 4px;
  cursor: pointer;
}

.canvas-color-preview {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid rgb(75, 75, 75);
}

.canvas-reset {
  padding: 6px 12px;
  border: none;
  border-radius: 3px;
  color: white;
  cursor: pointer;
  font-size: 16px;
  margin-right: 4px;
  background-color: red;
}

.canvas-save {
  padding: 6px 12px;
  border: none;
  border-radius: 3px;
  color: white;
  cursor: pointer;
  font-size: 16px;
  background-color: green;
}
</style>