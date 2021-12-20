import M$plugin$Munpanel from 'C:/proyectos/munpanel/src/facade/js/munpanel';
import M$control$MunpanelControl from 'C:/proyectos/munpanel/src/facade/js/munpanelcontrol';
import M$impl$control$MunpanelControl from 'C:/proyectos/munpanel/src/impl/ol/js/munpanelcontrol';

if (!window.M.plugin) window.M.plugin = {};
if (!window.M.control) window.M.control = {};
if (!window.M.impl) window.M.impl = {};
if (!window.M.impl.control) window.M.impl.control = {};
window.M.plugin.Munpanel = M$plugin$Munpanel;
window.M.control.MunpanelControl = M$control$MunpanelControl;
window.M.impl.control.MunpanelControl = M$impl$control$MunpanelControl;



