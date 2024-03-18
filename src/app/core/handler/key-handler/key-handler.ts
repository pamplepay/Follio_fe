
export class KeyHandler {

  static isAllowededInputKey(e: any) {
    return this.withControlKey(e) || this.isDirectionKey(e) || this.isControlKey(e) 
      || this.isAltKey(e) || this.isTabKey(e) || this.isShiftKey(e) || this.isHomeKey(e)
      || this.isEndKey(e);
  }

  static withControlKey(e: any) {
    return e.ctrlKey;
  }

  static isDirectionKey(e: any) {
    return e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Enter';
  }

  static isHomeKey(e: any) {
    return e.key === 'Home';
  }

  static isEndKey(e: any) {
    return e.key === 'End';
  }
  
  static isControlKey(e: any) {
    return e.key === 'Control';
  }

  static isAltKey(e: any) {
    return e.key === 'Alt';
  }

  static isTabKey(e: any) {
    return e.key === 'Tab';
  }

  static isShiftKey(e: any) {
    return e.key === 'Shift';
  }

}
