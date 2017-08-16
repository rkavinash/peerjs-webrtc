import { SimplewebrtcPage } from './app.po';

describe('simplewebrtc App', () => {
  let page: SimplewebrtcPage;

  beforeEach(() => {
    page = new SimplewebrtcPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
