function Virtualizt(setting) {
  /*
    setting = {
      node: node,
      itemHeight: 50,
      height: 300,
      data: arrayOf(item),
      item: node,
    }
  */
  var root = setting.node;
  var tolerance = 3 * setting.itemHeight;
  var totalHeight = setting.itemHeight * setting.data.length;
  root.style.cssText = `
    min-height: ${setting.height}px;
    height: ${setting.height}px;
    max-height: ${setting.height}px;
    position: relative;
  `;
  root.style.minHeight = setting.height + 'px';
  root.style.overflow = 'scroll';
  root.lastStartIndex = 0;
  root.lastEndIndex = 0;

  var itemElements = [];
  
  for(var i = 0; i < setting.data.length; i++){
    var currentItem = document.createElement('div');
    currentItem.innerHTML = setting.data[i];
    currentItem.position = setting.itemHeight * i;
    currentItem.style.cssText = `
      position: absolute;
      min-height: ${setting.itemHeight}px;
      height: ${setting.itemHeight}px;
      min-width: ${setting.itemHeight}px;
      width: ${setting.itemHeight}px;
      top: ${currentItem.position}px;
      padding-bottom: ${totalHeight - (setting.itemHeight * (i+1))}px;
      border: 1px solid black;
      font-size: 25px;
    `;
    
    if(setting.itemHeight * i <= setting.height + tolerance) {
      root.append(currentItem);
      root.lastEndIndex = i;
    }
     
    itemElements.push(currentItem);
  }
  
  root.addEventListener('scroll', function(){
    var startIndex = Math.floor((root.scrollTop - tolerance) / setting.itemHeight);
    var endIndex = Math.floor((setting.height + root.scrollTop + tolerance) / setting.itemHeight);
    
    if(startIndex < 0) startIndex = 0;
    if(endIndex >= itemElements.length) endIndex = itemElements.length - 1;
    
    if(root.lastStartIndex > startIndex) {
      // scrolling up, load prev data
      var diff = Math.abs(root.lastStartIndex - startIndex);
      var temp = diff + 1;
      
      while(diff > 0) {
        var indexToRemove = endIndex + diff;
        var indexToAdd = root.lastStartIndex - temp + diff;
        
        if(indexToRemove < itemElements.length) {
          console.log("Removed index:", indexToRemove);
          root.removeChild(itemElements[indexToRemove]);
        }
        if(indexToAdd > -1) {
          console.log("Prepended index:", indexToAdd);
          root.prepend(itemElements[indexToAdd]);
        }
        
        diff--;
      }
    }

    if(root.lastEndIndex < endIndex) {
      // scrolling down, load next data
      var diff = Math.abs(root.lastEndIndex - endIndex);
      var temp = diff + 1;
      
      while(diff > 0) {
        var indexToRemove = startIndex - diff;
        var indexToAdd = root.lastEndIndex + temp - diff;

        if(indexToRemove > -1) {
          console.log("Removed index:", indexToRemove);
          root.removeChild(itemElements[indexToRemove]);
        }
        if(indexToAdd < itemElements.length) {
          console.log("Appended index:", indexToAdd);
          root.append(itemElements[indexToAdd]);
        }

        diff--;
      }
    }
    
    root.lastStartIndex = startIndex;
    root.lastEndIndex = endIndex;
  });
}

window.onload = function() {
  console.log("loaded!");

  var data = [];
  for(var i = 1; i <= 200; i++){
    data.push(i);
  }
  var virtualizt = document.getElementById('virtualizt');

  Virtualizt({
    node: virtualizt,
    itemHeight: 50,
    height: 300,
    data: data
  });
}