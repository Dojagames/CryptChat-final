<script>
export default {
  data() {
    return {
      numSpheres: 5, // Default number of spheres
      numLightSpots: 6, // Default number of light spots
      baseSphereSize: 13, // Base size for spheres
      sphereSizeVariation: 10, // Size variation for spheres
      baseLightSpotSize: 15, // Base size for light spots
      lightSpotSizeVariation: 20, // Size variation for light spots
      lightSpotLuminanceVariation: 0.2, //variation

      baseColor: { r: 230, g: 30, b: 210 }, // Base RGB color
      backgroundColor: '#2a004d', // Background color
      sphereBlurAmount: 4, // Blur amount for spheres

      spheres: [],
      lightSpots: []
    };
  },
  mounted() {
    this.generateLightSpots();
    this.generateSpheres();
    const root = document.documentElement;
    root.style.setProperty('--background-base-r', this.baseColor.r);
    root.style.setProperty('--background-base-g', this.baseColor.g);
    root.style.setProperty('--background-base-b', this.baseColor.b);
  },
  methods: {
    generateSpheres() {
      const generatedSpheres = [];
      let attempts = 0;
      const maxAttempts = 1000; // Maximum number of attempts to place spheres
      for (let i = 0; i < this.numSpheres; i++) {
        let position;
        let overlaps;
        do {
          if (attempts >= maxAttempts) {
            console.warn('Reached maximum attempts, stopping sphere placement');
            this.spheres = generatedSpheres;
            return;
          }
          position = {
            top: Math.random() * 80 + 10, // Random percentage between 10% and 90%
            left: Math.random() * 80 + 10, // Random percentage between 10% and 90%
            size: Math.random() * this.sphereSizeVariation + this.baseSphereSize // Random size with base size and variation
          };
          overlaps = generatedSpheres.some(
            (sphere) =>
              Math.abs(sphere.top - position.top) < position.size + sphere.size &&
              Math.abs(sphere.left - position.left) < position.size + sphere.size
          );
          attempts++;
        } while (overlaps);
        generatedSpheres.push(position);
      }
      this.spheres = generatedSpheres;
    },
    generateLightSpots() {
      const generatedLightSpots = [];
      for (let i = 0; i < this.numLightSpots; i++) {
        generatedLightSpots.push({
          top: Math.random() * 90 + 5, // Random percentage between 20% and 80%
          left: Math.random() * 90 + 5, // Random percentage between 20% and 80%
          size: Math.random() * this.lightSpotSizeVariation + this.baseLightSpotSize // Random size with base size and variation
        });
      }
      this.lightSpots = generatedLightSpots;
    },
    getSphereStyle(sphere) {
      const sizeInPixels = `${sphere.size * 10}px`; // Convert percentage size to pixels for consistency
      return {
        top: `${sphere.top}%`,
        left: `${sphere.left}%`,
        width: sizeInPixels,
        height: sizeInPixels,
        background: `radial-gradient(circle at center, var(--sphere-color-${(this.spheres.indexOf(sphere) % 8) + 1}) 0%, rgba(var(--background-base-r), var(--background-base-g), var(--background-base-b), 0.95) 100%)`,
        'border-radius': '50%', // Ensure it is always circular
        filter: `blur(${this.sphereBlurAmount}px)`
      };
    },
    getLightSpotStyle(lightSpot) {
      const sizeInPixels = `${lightSpot.size * 10}px`; // Convert percentage size to pixels for consistency
      return {
        top: `${lightSpot.top}%`,
        left: `${lightSpot.left}%`,
        width: sizeInPixels,
        height: sizeInPixels,
        filter: 'blur(50px)',
        opacity: (1 - Math.random() * this.lightSpotLuminanceVariation).toFixed(2)
      };
    }
  }
};
</script>

<template>
  <div class="background-wrapper">
    <div class="background-container">
      <div class="background">
        <div v-for="(sphere, index) in spheres" :key="`sphere-${index}`" :class="['sphere', `sphere-${index}`]" :style="getSphereStyle(sphere)"></div>
        <div v-for="(lightSpot, index) in lightSpots" :key="`light-spot-${index}`" :class="['light-spot', `light-spot-${index}`]" :style="getLightSpotStyle(lightSpot)"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Base RGB values for color scheme */
.background-wrapper {


  /* Adjusted colors using calc, with more variation */
  --sphere-color-1: rgb(calc(var(--background-base-r) - 30), calc(var(--background-base-g) - 15), calc(var(--background-base-b) + 20));
  --sphere-color-2: rgb(calc(var(--background-base-r) + 25), calc(var(--background-base-g) - 35), calc(var(--background-base-b) - 10));
  --sphere-color-3: rgb(calc(var(--background-base-r) + 40), calc(var(--background-base-g) + 20), calc(var(--background-base-b) - 25));
  --sphere-color-4: rgb(calc(var(--background-base-r) - 20), calc(var(--background-base-g) - 10), calc(var(--background-base-b) - 30));
  --sphere-color-5: rgb(calc(var(--background-base-r) + 10), calc(var(--background-base-g) - 40), calc(var(--background-base-b) + 15));
  --sphere-color-6: rgb(calc(var(--background-base-r) - 35), calc(var(--background-base-g) + 5), calc(var(--background-base-b) - 20));
  --sphere-color-7: rgb(calc(var(--background-base-r) - 40), calc(var(--background-base-g) + 10), calc(var(--background-base-b) - 5));
  --sphere-color-8: rgb(calc(var(--background-base-r) + 15), calc(var(--background-base-g) - 20), calc(var(--background-base-b) + 30));

  /* Light spot color using base RGB values */
  --light-spot-color: rgba(var(--background-base-r), var(--background-base-g), var(--background-base-b), 0.5);
  --background-color: #2a004d;
}

.background-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1; /* Ensure background stays behind all other elements */
  overflow: hidden;
}

.background-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--background-color); /* Dark purple background */
  overflow: hidden;
}

.background {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 177.78vh; /* 16:9 aspect ratio based on height */
  height: 100vh;
  min-width: 100%;
  min-height: 100%;
  transform: translate(-50%, -50%);
}

.sphere {
  position: absolute;
  border-radius: 50%;
  opacity: 0.9;
  /*box-shadow: -5px -5px 10px rgba(255, 255, 255, 0.2), 5px 5px 10px rgba(0, 0, 0, 0.3); /* More subtle 3D effect shadow */
  animation: move 10s ease-in-out infinite alternate;
}

/* Subtle light-emitting spots */
.light-spot {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, var(--light-spot-color), rgba(var(--background-base-r), var(--background-base-g), var(--background-base-b), 0));
  filter: blur(50px);
  opacity: 0.4;
}

</style>
