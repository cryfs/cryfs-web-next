const mockAddListMember = jest.fn();
const mockGetListMember = jest.fn();
const mockUpdateListMember = jest.fn();
const mockSetConfig = jest.fn();

const mailchimp = {
  setConfig: mockSetConfig,
  lists: {
    addListMember: mockAddListMember,
    getListMember: mockGetListMember,
    updateListMember: mockUpdateListMember,
  },
  __mockAddListMember: mockAddListMember,
  __mockGetListMember: mockGetListMember,
  __mockUpdateListMember: mockUpdateListMember,
  __mockSetConfig: mockSetConfig,
};

export default mailchimp;
