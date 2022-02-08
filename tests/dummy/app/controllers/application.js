import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ApplicationController extends Controller {
  @tracked _calls = [];
  @tracked truncate = false;

  get notTruncate() {
    return !this.truncate;
  }

  @action toggleTruncate() {
    this.truncate = !this.truncate;
  }

  @action
  runFunction(name = '') {
    console.log('RUN FUNCTION', name);
    this._calls = [...this._calls, `Call with ${name}`];
  }
}
