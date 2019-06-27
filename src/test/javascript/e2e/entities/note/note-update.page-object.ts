import { element, by, ElementFinder, protractor, browser } from 'protractor';
import { clearElement, waitUntilDisplayed } from '../../util/utils';

export default class NoteUpdatePage {
  getPageTitle() {
    return element(by.id('jhipsterApp.note.home.createOrEditLabel'));
  }

  getFooter() {
    return element(by.id('footer'));
  }

  getSaveButton() {
    return element(by.id('save-entity'));
  }

  async isSaveButtonPresent() {
    return await this.getSaveButton().isPresent();
  }

  async save() {
    await this.getSaveButton().click();
  }

  async cancel() {
    await element(by.id('cancel-save')).click();
  }

  //--------------------------------------------------

  findLabelInput() {
    return element(by.css('input#note-label'));
  }

  async setLabelInput(label) {
    const elementInput = this.findLabelInput();
    await waitUntilDisplayed(elementInput);
    await elementInput.sendKeys(label);
  }

  async getLabelInput() {
    const elementInput = this.findLabelInput();
    return await elementInput.getAttribute('value');
  }

  async clearLabelInput() {
    const elementInput = this.findLabelInput();
    await clearElement(elementInput, 100);
  }

  //--------------------------------------------------

  findDescriptionInput() {
    return element(by.css('input#note-description'));
  }

  async setDescriptionInput(description) {
    const elementInput = this.findDescriptionInput();
    await waitUntilDisplayed(elementInput);
    await elementInput.sendKeys(description);
  }

  async getDescriptionInput() {
    const elementInput = this.findDescriptionInput();
    return await elementInput.getAttribute('value');
  }

  async clearDescriptionInput() {
    const elementInput = this.findDescriptionInput();
    await clearElement(elementInput, 100);
  }

  //--------------------------------------------------

  findDueDateInput() {
    return element(by.css('input#note-dueDate'));
  }

  async setDueDateInput(dueDate) {
    const elementInput = this.findDueDateInput();
    await waitUntilDisplayed(elementInput);
    await elementInput.sendKeys(dueDate);
  }

  async getDueDateInput() {
    const elementInput = this.findDueDateInput();
    return await elementInput.getAttribute('value');
  }

  async clearDueDateInput() {
    const elementInput = this.findDueDateInput();
    await clearElement(elementInput, 100);
  }
}
