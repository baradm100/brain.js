import Base from './base';
import makeKernel from '../utilities/make-kernel';
import { activate, measure } from '../activation/leaky-relu';

export default class LeakyRelu extends Base {
  constructor(inputLayer) {
    super();
    this.width = inputLayer.width;
    this.height = inputLayer.height;
    this.depth = inputLayer.depth;
    this.inputLayer = inputLayer;
  }
  setupKernels() {
    this.predictKernel = makeKernel(predict, {
      functions: [activate]
    });

    this.learnKernel = makeKernel(learn, {
      functions: [measure]
    });
  }

  predict() {
    this.weights = this.predictKernel(this.inputLayer.weights);
  }

  compare() {
    this.deltas = this.learnKernel(this.weights, this.deltas);
  }
}

export function predict(inputs) {
  return activate(inputs[this.thread.y][this.thread.x]);
}

export function learn(weights, deltas) {
  return measure(weights[this.thread.y][this.thread.x], deltas[this.thread.y][this.thread.x]);
}