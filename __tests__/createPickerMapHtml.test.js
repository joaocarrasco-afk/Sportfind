import { createPickerMapHtml } from '../src/features/map/createPickerMapHtml';
import { PICKER_MAP_MESSAGE_TYPE } from '../src/features/map/pickerMapBridge';

describe('createPickerMapHtml', () => {
  it('renders draggable picker pin', () => {
    const html = createPickerMapHtml(-23.55, -46.63);
    expect(html).toContain('draggable: true');
    expect(html).toContain('sportfind-picker-pin');
    expect(html).toContain(PICKER_MAP_MESSAGE_TYPE);
  });

  it('handles setPin command from app', () => {
    const html = createPickerMapHtml();
    expect(html).toContain("data.action === 'setPin'");
  });
});
