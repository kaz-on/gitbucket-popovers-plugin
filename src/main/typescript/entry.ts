import pluginCssText from '../styles/scss/popovers.scss';
import { addCssText } from './modules/utility/css-loader';
import { attachPopovers } from './modules/popovers';
import { attachTooltips } from './modules/tooltips';


function attach(root?: Document | Element) {
  const options = { root: root };
  attachPopovers(options);
  attachTooltips(options);
}


//
// Entry point
//

if(typeof Tipped === 'object' && Tipped !== null) {
  addCssText(pluginCssText);
  attach();

  setTimeout(() => { // Delayed execution
    // Create a hook for prettyPrint function to support preview
    const original = prettyPrint;
    prettyPrint = (opt_whenDone, opt_root) => {
      attach(opt_root);
      original(opt_whenDone, opt_root);
    }
  });
}
else {
  console.error('Popovers: Tipped object not found');
}
