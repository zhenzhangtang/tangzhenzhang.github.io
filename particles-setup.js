particlesJS("particles-js", {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 800,
      },
    },
    color: {
      value: "#add8e6",
    },
    shape: {
      type: "circle",
      stroke: {
        width: 2,
        color: "#ffffff",
      },
    },
    opacity: {
      value: 0.3,
      random: false,
    },
    size: {
      value: 9,
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#add8e6",
      opacity: 0.4,
      width: 2,
    },
  },
  interactivity: {
    detect_on: "window",
    events: {
      onhover: {
        enable: true,
        mode: "repulse",
      },
      onclick: {
        enable: true,
        mode: "push",
      },
    },
    modes: {
      repulse: {
        distance: 100,
        duration: 0.4,
      },
      push: {
        particles_nb: 4,
      },
    },
  },
});
