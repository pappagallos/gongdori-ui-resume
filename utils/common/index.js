const utilCommon = {
    getRandomKey: () => {
      return Math.random()
        .toString(36)
        .split(".")[1];
    },
}

export default utilCommon;