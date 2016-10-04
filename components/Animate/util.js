

export const randomGoatAnimationSequece =  function switchGoatAnimation () {
  const normal = [0];
  const walk = [1,2];
  const eat = [0,4,5,6];
  const disgust = [0,7,7,7,7];

  const sequence = Math.floor(Math.random() * 4);
  switch (sequence) {
    case 0:
      return normal;
    case 1:
      return walk;
    case 2:
      return eat;
    case 3:
      return disgust;
    default:
      conole.error('Unsupported goat sequence sequence');
  }
};

export const randomOmnivoreAnimationSequence = function switchOmnivoreAnimation () {
  const normal = [0];
  const walk = [6,7];
  const eat = [0,4,0,5];
  const disgust = [0,3,3,3,3,3];
  const celebrate = [0,1,2,1];

  const sequence = Math.floor(Math.random() * 5);
  switch (sequence) {
    case 0: {
      return normal;
    }
    case 1: {
      return walk;
    }
    case 2: {
      return eat;
    }
    case 3: {
      return disgust;
    }
    case 4: {
      return celebrate;
    }
  }
};

export const randomMammalAnimationSequence = function switchMammalAnimation () {
  const normal = [0];
  const eat = [0,4,5];
  const disgust = [0,3,3,3,3];
  const celebrate = [0,2,1,2]

  const sequence = Math.floor(Math.random() * 4);
  switch (sequence) {
    case 0: {
      return normal;
    }
    case 1: {
      return eat;
    }
    case 2: {
      return disgust;
    }
    case 3: {
      return celebrate;
    }
  }
};

export const randomFrogAnimationSequence = function switchFrogAnimation () {
  const normal = [0];
  const eat = [0,2,2,3,4,5];
  const disgust = [0,1,1,1,1];

  const sequence = Math.floor(Math.random() * 3);
  switch (sequence) {
    case 0: {
      return normal;
    }
    case 1: {
      return eat;
    }
    case 2: {
      return disgust;
    }
  }
};
