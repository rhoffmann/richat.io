let animal = {
  animalType: 'animal',

  describe() {
    return `An ${this.animalType}, with ${this.furColor} fur,
      ${this.legs} legs, and a ${this.tail} tail.`;
  }
}

module.exports = {
  start: function() {
    let mouse = Object.assign(Object.create(animal), {
      animalType: 'mouse',
      furColor: 'brown',
      legs: 4,
      tail: 'long, skinny'
    });
    console.log(mouse.describe());
  }
}