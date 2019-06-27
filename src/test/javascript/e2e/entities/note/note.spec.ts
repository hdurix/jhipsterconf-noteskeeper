/* tslint:disable no-unused-expression */
import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import NoteComponentsPage from './note.page-object';
import { NoteDeleteDialog } from './note.page-object';
import NoteUpdatePage from './note-update.page-object';
import NoteDetailsPage from './note-details.page-object';
import {
  waitUntilDisplayed,
  waitUntilHidden,
  getDangerToast,
  getInfoToast,
  getSuccessToast,
  waitSilentlyUntilDisplayed
} from '../../util/utils';

const expect = chai.expect;

describe('Note e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let noteUpdatePage: NoteUpdatePage;
  let noteDetailsPage: NoteDetailsPage;
  let noteComponentsPage: NoteComponentsPage;
  let noteDeleteDialog: NoteDeleteDialog;
  let nbButtonsBeforeCreate = 0;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.waitUntilDisplayed();

    await signInPage.username.sendKeys('admin');
    await signInPage.password.sendKeys('admin');
    await signInPage.loginButton.click();
    await signInPage.waitUntilHidden();
    await waitUntilDisplayed(navBarPage.entityMenu);
  });

  it('should load Notes', async () => {
    await navBarPage.getEntityPage('note');
    noteComponentsPage = new NoteComponentsPage();

    await waitSilentlyUntilDisplayed(noteComponentsPage.getDeleteButtons().last());
    const heading = noteComponentsPage.getTitle();
    await waitUntilDisplayed(heading);

    const footer = noteComponentsPage.getFooter();
    await waitUntilDisplayed(footer);

    expect(await heading.getText()).not.to.be.empty;
    nbButtonsBeforeCreate = await noteComponentsPage.countNote();
  });

  it('should load create Note page', async () => {
    await noteComponentsPage.clickOnCreateButton();
    noteUpdatePage = new NoteUpdatePage();

    const heading = noteUpdatePage.getPageTitle();
    await waitUntilDisplayed(heading);

    const footer = noteUpdatePage.getFooter();
    await waitUntilDisplayed(footer);

    await waitUntilDisplayed(noteUpdatePage.getSaveButton());

    expect(await heading.getText()).to.match(/Create or edit a Note/);
  });

  it('should create and save Notes', async () => {
    await noteUpdatePage.setLabelInput('label');
    expect(await noteUpdatePage.getLabelInput()).to.match(/label/);

    await noteUpdatePage.setDescriptionInput('description');
    expect(await noteUpdatePage.getDescriptionInput()).to.match(/description/);

    await noteUpdatePage.setDueDateInput('01-01-2001');
    expect(await noteUpdatePage.getDueDateInput()).to.eq('2001-01-01');

    await noteUpdatePage.save();
    await waitUntilHidden(noteUpdatePage.getSaveButton());
    expect(await noteUpdatePage.isSaveButtonPresent()).to.be.false;

    const toast = getSuccessToast();
    await waitUntilDisplayed(toast);
    // Success toast should appear
    expect(await toast.isPresent()).to.be.true;

    await noteComponentsPage.waitUntilNoteCountIs(nbButtonsBeforeCreate + 1);
    expect(await noteComponentsPage.countNote()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should load details Note page and fetch data', async () => {
    await noteComponentsPage.waitUntilLoaded();
    await noteComponentsPage.clickOnLastDetailsButton();
    noteDetailsPage = new NoteDetailsPage();

    const heading = noteDetailsPage.getPageTitle();
    await waitUntilDisplayed(heading);

    const footer = noteUpdatePage.getFooter();
    await waitUntilDisplayed(footer);

    await waitUntilDisplayed(await noteDetailsPage.getBackButton());
    expect(await heading.getText()).not.to.be.empty;

    const firstDetail = noteDetailsPage.getFirstDetail();
    expect(await firstDetail.getText()).not.to.be.empty;

    await noteDetailsPage.getBackButton().click();
    await noteComponentsPage.waitUntilNoteCountIs(nbButtonsBeforeCreate + 1);
  });

  it('should load edit Note page and fetch data', async () => {
    await noteComponentsPage.waitUntilLoaded();
    await noteComponentsPage.clickOnLastEditButton();
    const heading = noteUpdatePage.getPageTitle();
    await waitUntilDisplayed(heading);

    const footer = noteUpdatePage.getFooter();
    await waitUntilDisplayed(footer);

    await waitUntilDisplayed(noteUpdatePage.getSaveButton());

    expect(await heading.getText()).not.to.be.empty;

    await noteUpdatePage.clearLabelInput();
    await noteUpdatePage.setLabelInput('modified');
    expect(await noteUpdatePage.getLabelInput()).to.match(/modified/);

    await noteUpdatePage.clearDescriptionInput();
    await noteUpdatePage.setDescriptionInput('modified');
    expect(await noteUpdatePage.getDescriptionInput()).to.match(/modified/);

    await noteUpdatePage.clearDueDateInput();
    await noteUpdatePage.setDueDateInput('01-01-2019');
    expect(await noteUpdatePage.getDueDateInput()).to.eq('2019-01-01');

    await noteUpdatePage.save();

    await waitUntilHidden(noteUpdatePage.getSaveButton());

    expect(await noteUpdatePage.isSaveButtonPresent()).to.be.false;

    const toast = getInfoToast();
    await waitUntilDisplayed(toast);
    // Info toast should appear
    expect(await toast.isPresent()).to.be.true;
  });

  it('should delete last Note', async () => {
    await noteComponentsPage.waitUntilLoaded();
    const nbNoteBeforeDelete = await noteComponentsPage.countNote();
    await noteComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);
    noteDeleteDialog = new NoteDeleteDialog();
    expect(await noteDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/jhipsterApp.note.delete.question/);

    await noteDeleteDialog.clickOnConfirmButton();
    await waitUntilHidden(deleteModal);

    // Delete modal should disappear
    expect(await deleteModal.isDisplayed()).to.be.false;

    const toast = getDangerToast();

    // Danger toast should appear
    expect(await toast.isPresent()).to.be.true;

    expect(await noteComponentsPage.countNote()).to.eq(nbNoteBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
