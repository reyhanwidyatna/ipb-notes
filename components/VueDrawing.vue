<template>
  <div class="canvas">
    <canvas
      ref="canvas"
      width="260"
      height="340"
      @touchstart="startDrawing"
      @touchmove="draw"
      @touchend="stopDrawing"
      @mousedown="startDrawing"
      @mousemove="draw"
      @mouseup="stopDrawing"
      @touchcancel="stopDrawing"
    ></canvas>
    <div class="canvas-action">
      <button class="canvas-reset" @click="resetCanvas">
        Reset
      </button>
      <button class="canvas-save" @click="saveCanvas">
        Simpan
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isDrawing: false,
      context: null,
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
      let clientX, clientY;

      if (event.type.startsWith("touch")) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      } else {
        clientX = event.offsetX;
        clientY = event.offsetY;
      }

      const canvasRect = this.$refs.canvas.getBoundingClientRect();
      const offsetX = clientX - canvasRect.left;
      const offsetY = clientY - canvasRect.top;

      return { offsetX, offsetY };
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
        this.$emit('create', imageDataUrl);
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
  background-color: white;
}

.canvas-reset {
  padding: 8px 12px;
  border: none;
  border-radius: 3px;
  color: white;
  cursor: pointer;
  font-size: 16px;
  background-color: red;
}

.canvas-save {
  padding: 8px 12px;
  border: none;
  border-radius: 3px;
  color: white;
  cursor: pointer;
  font-size: 16px;
  background-color: green;
}
</style>