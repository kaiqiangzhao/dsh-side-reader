window.__ModuleLoader__.load({
  id: 'dsh-plugin-deepread',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const { useState, useEffect, useRef, useCallback, useMemo } = React;

    const NS = 'pdfReader';
    const PICKER_ID = 'deepread';
    const PICKER_KIND = 'pdf-reader';
    const VIEWER_ID = 'deepread/viewer';
    const VIEWER_KIND = 'pdf-reader-viewer';
    const MAX_SELECTION = 100000;
    const MIN_ZOOM = 0.25;
    const MAX_ZOOM = 4;
    const PAGE_GAP = 12;
    const PAGE_INSET = 12;
    const MAX_CANVAS_PIXELS = 16777216;
    const MAX_TEXT_CHARS = 1000000;
    const MAX_TABLE_ROWS = 2000;
    const MAX_TABLE_COLS = 200;
    const MAX_NAME = 24;
    /** What a button does with the selection: put it in the composer, put it there and submit, or copy it. */
    const ACTIONS = ['insert', 'send', 'copy'];
    const TOOLBAR_HEIGHT = 48;

    const zh = {
      'tab.title': 'DeepRead',
      'guide.description': '阅读文档,划词发送到输入框',
      'header.hint': '划词后点击弹出的按钮,发送到输入框',
      'upload.button': '上传文件',
      'upload.drop': '或把文件拖到这里',
      'upload.formats': '支持 pdf, markdown, epub, txt, xlsx 和 csv',
      'upload.dropActive': '松开即可上传',
      'upload.notPdf': '不支持该格式',
      'upload.failed': '保存失败,可能是浏览器存储空间不足',
      'history.title': '上传历史',
      'history.empty': '还没有上传过文件',
      'history.remove': '从历史中删除',
      'history.clear': '清空历史',
      'history.justNow': '刚刚',
      'history.minutesAgo': '{count} 分钟前',
      'history.hoursAgo': '{count} 小时前',
      'history.yesterday': '昨天',
      'history.daysAgo': '{count} 天前',
      'history.missing': '文件已不在历史中,请重新上传',
      'error.open': '无法打开该文件',
      'error.storage': '无法使用浏览器本地存储',
      'viewer.loading': '正在加载 PDF…',
      'viewer.loadingText': '正在加载…',
      'viewer.emptySheet': '这个工作表是空的',
      'viewer.failedText': '无法显示此文件',
      'viewer.rows': '{count} 行',
      'viewer.chars': '{count} 字符',
      'viewer.toc': '目录',
      'viewer.showSource': '查看源码',
      'viewer.showRendered': '查看渲染效果',
      'viewer.truncatedText': '内容过长,仅显示前 100 万字符',
      'viewer.truncatedRows': '内容过长,仅显示前 2000 行',
      'viewer.failed': '无法显示此 PDF',
      'viewer.password': '此 PDF 需要密码,暂不支持打开',
      'viewer.retry': '重试',
      'viewer.pages': '{count} 页',
      'viewer.zoomIn': '放大',
      'viewer.zoomOut': '缩小',
      'viewer.fit': '适应宽度',
      'viewer.reload': '重新加载',
      'send.translate': '翻译',
      'send.explain': '解释',
      'send.summary': '总结',
      'send.copy': '复制',
      'send.toComposer': '复制到输入框',
      'send.translate.after': '请把以上内容翻译成中文;如果已经是中文,请翻译成英文。',
      'send.explain.after': '请解释以上内容。',
      'send.summary.after': '请用简洁的要点总结以上内容。',
      'send.more': '更多',
      'send.sent': '已发送',
      'send.done': '已放入输入框',
      'send.copied': '已复制到剪贴板',
      'send.copyFailed': '复制失败,请检查剪贴板权限',
      'send.failed': '输入框暂不可用',
      'view.buttons': '发送按钮',
      'settings.back': '返回',
      'settings.add': '新增按钮',
      'settings.reset': '恢复默认',
      'settings.remove': '删除',
      'settings.edit': '编辑',
      'settings.group.bar': '工具栏',
      'settings.group.menu': '折叠菜单',
      'settings.group.empty.bar': '拖到这里,显示在工具栏',
      'settings.group.empty.menu': '拖到这里,收进折叠菜单',
      'settings.dialog.add': '新增按钮',
      'settings.dialog.edit': '编辑按钮',
      'settings.cancel': '取消',
      'settings.save': '保存',
      'settings.unnamed': '未命名',
      'settings.removeLast': '至少保留一个按钮',
      'settings.drag': '拖动排序(聚焦后可按 ↑ ↓)',
      'settings.name': '按钮名称',
      'settings.namePlaceholder': '例如:翻译',
      'settings.action': '点击后',
      'settings.action.insert': '仅放入输入框',
      'settings.action.send': '放入输入框并发送',
      'settings.action.copy': '复制选中文字',
      'settings.after': '提示词',
      'settings.afterPlaceholder': '例如:请用一句话总结以上内容',
      'settings.afterHint': '附在选中文字之后,另起一行',
      'settings.nameRequired': '请填写按钮名称',
      'settings.icon': '图标',
      'settings.icon.none': '不显示图标',
      'settings.icon.send': '发送',
      'settings.icon.insert': '放入',
      'settings.icon.translate': '翻译',
      'settings.icon.summary': '总结',
      'settings.icon.explain': '解释',
      'settings.icon.question': '提问',
      'settings.icon.copy': '复制',
      'settings.icon.bookmark': '收藏',
      'settings.icon.sparkle': '智能',
      'settings.icon.edit': '改写',
      'settings.icon.search': '搜索',
      'settings.icon.code': '代码',
      'settings.hint': '拖动卡片调整顺序,或拖到另一个区域',
    };
    const en = {
      'tab.title': 'DeepRead',
      'guide.description': 'Read documents and send selections to the composer',
      'header.hint': 'Select text, then click a popup button to send it to the composer',
      'upload.button': 'Upload file',
      'upload.drop': 'or drop files here',
      'upload.formats': 'Supports pdf, markdown, epub, txt, xlsx and csv',
      'upload.dropActive': 'Release to upload',
      'upload.notPdf': 'Unsupported format',
      'upload.failed': 'Could not save the file; browser storage may be full',
      'history.title': 'Upload history',
      'history.empty': 'No files uploaded yet',
      'history.remove': 'Remove from history',
      'history.clear': 'Clear history',
      'history.justNow': 'Just now',
      'history.minutesAgo': '{count} min ago',
      'history.hoursAgo': '{count} h ago',
      'history.yesterday': 'Yesterday',
      'history.daysAgo': '{count} days ago',
      'history.missing': 'This file is no longer in the history. Upload it again',
      'error.open': 'Cannot open this file',
      'error.storage': 'Browser local storage is unavailable',
      'viewer.loading': 'Loading PDF…',
      'viewer.loadingText': 'Loading…',
      'viewer.emptySheet': 'This sheet is empty',
      'viewer.failedText': 'Cannot display this file',
      'viewer.rows': '{count} rows',
      'viewer.chars': '{count} characters',
      'viewer.toc': 'Contents',
      'viewer.showSource': 'Show source',
      'viewer.showRendered': 'Show rendered',
      'viewer.truncatedText': 'Too long; showing the first 1,000,000 characters',
      'viewer.truncatedRows': 'Too long; showing the first 2000 rows',
      'viewer.failed': 'Cannot display this PDF',
      'viewer.password': 'This PDF requires a password; password-protected files are not supported.',
      'viewer.retry': 'Retry',
      'viewer.pages': '{count} pages',
      'viewer.zoomIn': 'Zoom in',
      'viewer.zoomOut': 'Zoom out',
      'viewer.fit': 'Fit width',
      'viewer.reload': 'Reload',
      'send.translate': 'Translate',
      'send.explain': 'Explain',
      'send.summary': 'Summarize',
      'send.copy': 'Copy',
      'send.toComposer': 'Copy to composer',
      'send.translate.after': 'Please translate the text above into Chinese; if it is already Chinese, translate it into English.',
      'send.explain.after': 'Please explain the text above.',
      'send.summary.after': 'Please summarize the text above in a few concise points.',
      'send.more': 'More',
      'send.sent': 'Sent',
      'send.done': 'Put in composer',
      'send.copied': 'Copied to clipboard',
      'send.copyFailed': 'Copy failed. Check clipboard permission',
      'send.failed': 'The composer is unavailable',
      'view.buttons': 'Send buttons',
      'settings.back': 'Back',
      'settings.add': 'Add button',
      'settings.reset': 'Restore defaults',
      'settings.remove': 'Delete',
      'settings.edit': 'Edit',
      'settings.group.bar': 'Toolbar',
      'settings.group.menu': 'Fold-out menu',
      'settings.group.empty.bar': 'Drop here to show on the toolbar',
      'settings.group.empty.menu': 'Drop here to fold into the menu',
      'settings.dialog.add': 'Add button',
      'settings.dialog.edit': 'Edit button',
      'settings.cancel': 'Cancel',
      'settings.save': 'Save',
      'settings.unnamed': 'Unnamed',
      'settings.removeLast': 'Keep at least one button',
      'settings.drag': 'Drag to reorder (or focus and press ↑ ↓)',
      'settings.name': 'Button name',
      'settings.namePlaceholder': 'e.g. Translate',
      'settings.action': 'When clicked',
      'settings.action.insert': 'Put in composer only',
      'settings.action.send': 'Put in composer and send',
      'settings.action.copy': 'Copy the selection',
      'settings.after': 'Prompt',
      'settings.afterPlaceholder': 'e.g. Summarize the text above in one sentence',
      'settings.afterHint': 'Added after the selection, on a new line',
      'settings.nameRequired': 'Enter a button name',
      'settings.icon': 'Icon',
      'settings.icon.none': 'No icon',
      'settings.icon.send': 'Send',
      'settings.icon.insert': 'Insert',
      'settings.icon.translate': 'Translate',
      'settings.icon.summary': 'Summarize',
      'settings.icon.explain': 'Explain',
      'settings.icon.question': 'Ask',
      'settings.icon.copy': 'Copy',
      'settings.icon.bookmark': 'Save',
      'settings.icon.sparkle': 'AI',
      'settings.icon.edit': 'Rewrite',
      'settings.icon.search': 'Search',
      'settings.icon.code': 'Code',
      'settings.hint': 'Drag cards to reorder, or into the other section',
    };

    /** Mutable plugin state shared by the separately mounted slot components. */
    const runtime = { ctx: undefined };
    /** Latest composer input face, published by a component mounted inside the composer scope. */
    const bridge = { sessionId: undefined, actions: undefined };

    function tr(key, params) {
      const ctx = runtime.ctx;
      if (ctx && ctx.locale) return ctx.locale.bind(NS)(key, params);
      return en[key] || key;
    }

    const CSS = `
.pdfr-root{box-sizing:border-box;display:flex;flex-direction:column;height:100%;min-height:0;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font-size:13px;line-height:1.5}
.pdfr-head{flex:none;padding:14px 16px 10px;display:flex;flex-direction:column;gap:6px}
.pdfr-title{display:flex;align-items:center;gap:8px;font-size:14px;font-weight:600}
.pdfr-title-text{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pdfr-hint{margin:0;color:var(--dsw-alias-label-secondary);font-size:12px}
.pdfr-icon-btn{flex:none;min-width:26px;height:26px;display:inline-flex;align-items:center;justify-content:center;gap:4px;border:none;background:none;border-radius:6px;color:var(--dsw-alias-label-secondary);cursor:pointer;padding:0 4px;font:inherit;font-size:12px}
.pdfr-icon-btn:hover:not(:disabled){background:color-mix(in srgb,var(--dsw-alias-label-primary) 7%,transparent);color:var(--dsw-alias-label-primary)}
.pdfr-icon-btn:disabled{opacity:.4;cursor:default}
.pdfr-list{flex:1;min-height:0;overflow:auto;padding:6px 8px 12px}
.pdfr-upload{flex:none;margin:4px 12px 8px;display:flex;flex-direction:column;align-items:center;gap:10px;padding:22px 16px;border:1px dashed var(--dsw-alias-border-l2);border-radius:12px;color:var(--dsw-alias-label-secondary);text-align:center;cursor:pointer;transition:background .12s,border-color .12s}
.pdfr-upload:hover,.pdfr-upload[data-active=true]{background:color-mix(in srgb,var(--dsw-alias-brand-primary) 8%,transparent);border-color:var(--dsw-alias-brand-primary)}
.pdfr-upload-formats{font-size:12px;opacity:.8;margin-top:-4px}
.pdfr-upload:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}
.pdfr-upload-btn{pointer-events:none;display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 14px;border-radius:999px;background:var(--dsw-alias-label-primary);color:var(--dsw-alias-bg-base);font-size:13px}
.pdfr-section{flex:none;display:flex;align-items:center;justify-content:space-between;padding:12px 16px 6px;color:var(--dsw-alias-label-secondary);font-size:12px}
.pdfr-section-title{display:inline-flex;align-items:baseline;gap:6px;font-weight:600}
.pdfr-section-count{font-weight:400;opacity:.75}
.pdfr-list-files{padding:0 0 14px}
.pdfr-files{margin:0 12px;border:.5px solid var(--dsw-alias-border-l2);border-radius:12px;background:var(--dsw-alias-bg-layer-1);overflow:hidden}
.pdfr-item{position:relative;display:flex;align-items:center;min-width:0;transition:background .12s}
.pdfr-item+.pdfr-item::before{content:"";position:absolute;top:0;left:60px;right:0;height:.5px;background:var(--dsw-alias-border-l2);pointer-events:none}
.pdfr-item:hover,.pdfr-item:focus-within{background:color-mix(in srgb,var(--dsw-alias-label-primary) 6%,transparent)}
.pdfr-item-open{flex:1;min-width:0;display:flex;align-items:center;gap:12px;padding:10px 4px 10px 12px;border:none;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}
.pdfr-item-open:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:-2px;border-radius:12px}
.pdfr-badge{--tone:var(--dsw-alias-label-secondary);flex:none;width:36px;height:36px;display:inline-flex;align-items:center;justify-content:center;border-radius:10px;color:var(--tone);background:color-mix(in srgb,var(--tone) 14%,transparent)}
.pdfr-badge[data-kind=pdf]{--tone:var(--dsw-alias-state-error-primary)}
.pdfr-badge[data-kind=epub]{--tone:var(--dsw-alias-brand-primary)}
.pdfr-badge[data-kind=sheet],.pdfr-badge[data-kind=table]{--tone:var(--dsw-alias-state-success-primary)}
.pdfr-item-text{flex:1;min-width:0;display:flex;flex-direction:column;gap:1px}
.pdfr-item-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500}
.pdfr-item-meta{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-secondary);font-size:12px}
.pdfr-item-del{margin-right:8px;opacity:0;transition:opacity .12s}
.pdfr-item:hover .pdfr-item-del,.pdfr-item:focus-within .pdfr-item-del,.pdfr-item-del:focus-visible{opacity:1}
@media (hover:none){.pdfr-item-del{opacity:1}}
.pdfr-empty{margin:0 12px;display:flex;flex-direction:column;align-items:center;gap:10px;padding:28px 16px;border:1px dashed var(--dsw-alias-border-l2);border-radius:12px;color:var(--dsw-alias-label-secondary);text-align:center}
.pdfr-empty-icon{width:44px;height:44px;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;background:color-mix(in srgb,var(--dsw-alias-label-primary) 7%,transparent)}
.pdfr-link{border:none;background:none;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;cursor:pointer;padding:2px 4px;border-radius:6px}
.pdfr-link:hover{color:var(--dsw-alias-label-primary);background:color-mix(in srgb,var(--dsw-alias-label-primary) 7%,transparent)}
.pdfr-state{padding:24px 16px;text-align:center;color:var(--dsw-alias-label-secondary)}
.pdfr-error{margin:6px 8px;padding:8px 10px;border-radius:8px;color:var(--dsw-alias-state-error-primary);background:color-mix(in srgb,var(--dsw-alias-state-error-primary) 10%,transparent);font-size:12px}
.pdfr-note{padding:6px 12px;color:var(--dsw-alias-label-secondary);font-size:12px}
.pdfr-scroll-text{background:var(--dsw-alias-bg-base);padding:12px 14px}
.pdfr-text{margin:0;font:12px/1.6 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:var(--dsw-alias-label-primary);white-space:pre;tab-size:4;user-select:text}
.pdfr-text[data-wrap=true]{white-space:pre-wrap;word-break:break-word}
.pdfr-md{max-width:760px;margin:0 auto;font-size:14px;line-height:1.7;user-select:text;overflow-wrap:anywhere}
.pdfr-md>:first-child{margin-top:0}
.pdfr-md p,.pdfr-md ul,.pdfr-md ol,.pdfr-md blockquote,.pdfr-md pre,.pdfr-md table,.pdfr-md hr{margin:0 0 .9em}
.pdfr-md h1,.pdfr-md h2,.pdfr-md h3,.pdfr-md h4,.pdfr-md h5,.pdfr-md h6{margin:1.4em 0 .6em;line-height:1.35;font-weight:600}
.pdfr-md h1{font-size:1.7em;padding-bottom:.3em;border-bottom:.5px solid var(--dsw-alias-border-l2)}
.pdfr-md h2{font-size:1.4em;padding-bottom:.25em;border-bottom:.5px solid var(--dsw-alias-border-l1)}
.pdfr-md h3{font-size:1.2em}.pdfr-md h4{font-size:1.05em}.pdfr-md h5,.pdfr-md h6{font-size:1em;color:var(--dsw-alias-label-secondary)}
.pdfr-md ul,.pdfr-md ol{padding-left:1.6em}
.pdfr-md li>p{margin:0 0 .3em}
.pdfr-md li>ul,.pdfr-md li>ol{margin:.2em 0 0}
.pdfr-md li:has(>input[type=checkbox]){list-style:none;margin-left:-1.3em}
.pdfr-md li>input[type=checkbox]{margin:0 .5em 0 0;vertical-align:middle}
.pdfr-md pre code.hljs{display:block}
.pdfr-md del{text-decoration:line-through;opacity:.7}
.pdfr-md blockquote{padding:.1em 1em;border-left:3px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary)}
.pdfr-md blockquote>:last-child{margin-bottom:0}
.pdfr-md code{font:.88em/1.5 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;padding:.15em .4em;border-radius:5px;background:color-mix(in srgb,var(--dsw-alias-label-primary) 9%,transparent)}
.pdfr-md pre{padding:10px 12px;border-radius:8px;overflow:auto;background:color-mix(in srgb,var(--dsw-alias-label-primary) 6%,transparent);border:.5px solid var(--dsw-alias-border-l1)}
.pdfr-md pre code{padding:0;background:none;font-size:12px;line-height:1.6;white-space:pre}
.pdfr-md a{color:var(--dsw-alias-brand-primary);text-decoration:underline;text-underline-offset:2px}
.pdfr-md hr{border:none;border-top:.5px solid var(--dsw-alias-border-l2)}
.pdfr-md table{display:block;max-width:100%;overflow:auto;border-collapse:collapse;font-size:13px}
.pdfr-md th,.pdfr-md td{border:.5px solid var(--dsw-alias-border-l2);padding:4px 10px;vertical-align:top}
.pdfr-md th{background:color-mix(in srgb,var(--dsw-alias-label-primary) 6%,transparent);font-weight:600}
.pdfr-md img{max-width:100%;height:auto;border-radius:4px}
.pdfr-md kbd{font:.85em ui-monospace,SFMono-Regular,Menlo,monospace;padding:.1em .4em;border-radius:4px;border:.5px solid var(--dsw-alias-border-l2);background:color-mix(in srgb,var(--dsw-alias-label-primary) 6%,transparent)}
.pdfr-md mark{background:color-mix(in srgb,var(--dsw-alias-state-success-primary) 25%,transparent);color:inherit;border-radius:3px;padding:0 .15em}
.pdfr-md sup,.pdfr-md sub{line-height:0}
.pdfr-md details{margin:0 0 .9em;padding:.4em .8em;border:.5px solid var(--dsw-alias-border-l2);border-radius:8px}
.pdfr-md summary{cursor:pointer;font-weight:500}
.pdfr-md .footnotes{margin-top:2em;padding-top:.6em;border-top:.5px solid var(--dsw-alias-border-l2);font-size:.9em;color:var(--dsw-alias-label-secondary)}
.pdfr-md .footnotes h2{font-size:1em;border:none;margin:0 0 .4em}
.pdfr-md .hljs-comment,.pdfr-md .hljs-quote{color:var(--dsw-alias-label-secondary);font-style:italic}
.pdfr-md .hljs-keyword,.pdfr-md .hljs-selector-tag,.pdfr-md .hljs-built_in,.pdfr-md .hljs-type,.pdfr-md .hljs-literal{color:var(--dsw-alias-brand-primary)}
.pdfr-md .hljs-string,.pdfr-md .hljs-regexp,.pdfr-md .hljs-addition{color:var(--dsw-alias-state-success-primary)}
.pdfr-md .hljs-number,.pdfr-md .hljs-symbol,.pdfr-md .hljs-attr,.pdfr-md .hljs-attribute,.pdfr-md .hljs-deletion,.pdfr-md .hljs-variable,.pdfr-md .hljs-template-variable{color:var(--dsw-alias-state-error-primary)}
.pdfr-md .hljs-title,.pdfr-md .hljs-section,.pdfr-md .hljs-name{color:var(--dsw-alias-brand-primary);font-weight:600}
.pdfr-md .hljs-emphasis{font-style:italic}.pdfr-md .hljs-strong{font-weight:700}
.pdfr-table{border-collapse:collapse;font-size:12px;user-select:text}
.pdfr-table th,.pdfr-table td{border:.5px solid var(--dsw-alias-border-l2);padding:4px 8px;text-align:left;vertical-align:top;max-width:360px;overflow-wrap:anywhere}
.pdfr-table th{position:sticky;top:-12px;background:var(--dsw-alias-bg-overlay);font-weight:600}
.pdfr-tabs{flex:none;display:flex;gap:2px;padding:6px 10px 0;border-bottom:.5px solid var(--dsw-alias-border-l1);overflow-x:auto}
.pdfr-tab{flex:none;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;border:none;background:none;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;padding:4px 10px;border-radius:6px 6px 0 0;cursor:pointer}
.pdfr-tab:hover{color:var(--dsw-alias-label-primary)}
.pdfr-tab[aria-selected=true]{color:var(--dsw-alias-label-primary);background:color-mix(in srgb,var(--dsw-alias-label-primary) 8%,transparent);cursor:default}
.pdfr-epub{max-width:680px;margin:0 auto;font-size:14px;line-height:1.75;user-select:text}
.pdfr-epub p{margin:0 0 .8em}
.pdfr-epub h1,.pdfr-epub h2,.pdfr-epub h3,.pdfr-epub h4,.pdfr-epub h5,.pdfr-epub h6{margin:1.2em 0 .6em;line-height:1.35}
.pdfr-epub h1{font-size:1.5em}.pdfr-epub h2{font-size:1.3em}.pdfr-epub h3{font-size:1.15em}
.pdfr-epub-li{margin:0 0 .4em;padding-left:1.2em}
.pdfr-epub-chapter{padding-bottom:1.2em;margin-bottom:1.2em;border-bottom:.5px solid var(--dsw-alias-border-l1)}
.pdfr-epub-body{flex:1;min-height:0;position:relative;background:#fff}
.pdfr-epub-host{position:absolute;inset:0;overflow:hidden}
.pdfr-toc{position:absolute;top:0;right:0;bottom:0;z-index:3;width:min(320px,86%);overflow:auto;box-sizing:border-box;padding:6px;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);border-left:.5px solid var(--dsw-alias-border-l2);box-shadow:-6px 0 18px rgba(0,0,0,.18)}
.pdfr-toc-item{display:block;width:100%;box-sizing:border-box;text-align:left;border:none;background:none;color:inherit;font:inherit;padding:5px 8px;border-radius:6px;cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pdfr-toc-item:hover{background:color-mix(in srgb,var(--dsw-alias-label-primary) 7%,transparent)}
.pdfr-viewer{box-sizing:border-box;display:flex;flex-direction:column;height:100%;min-height:0;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font-size:13px}
.pdfr-toolbar{flex:none;user-select:none;-webkit-user-select:none;height:38px;box-sizing:border-box;display:flex;align-items:center;gap:2px;padding:0 8px 0 14px;border-bottom:.5px solid var(--dsw-alias-border-l1)}
.pdfr-toolbar-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-secondary)}
.pdfr-zoom{min-width:44px;text-align:center;color:var(--dsw-alias-label-secondary);font-size:12px;font-variant-numeric:tabular-nums}
.pdfr-scroll{flex:1;min-height:0;overflow:auto;background:color-mix(in srgb,var(--dsw-alias-label-primary) 5%,var(--dsw-alias-bg-base));padding:${PAGE_INSET}px;box-sizing:border-box}
.pdfr-pages{display:flex;flex-direction:column;align-items:flex-start;gap:${PAGE_GAP}px;width:max-content;min-width:100%}
.pdfr-page{position:relative;flex:none;margin:0 auto;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.18);--scale-factor:1}
.pdfr-page canvas{display:block;position:absolute;inset:0;width:100%;height:100%}
.pdfr-page .textLayer{position:absolute;text-align:initial;inset:0;overflow:hidden;opacity:1;line-height:1;-webkit-text-size-adjust:none;text-size-adjust:none;forced-color-adjust:none;transform-origin:0 0;z-index:2}
.pdfr-page .textLayer :is(span,br){color:transparent;position:absolute;white-space:pre;cursor:text;transform-origin:0% 0%}
.pdfr-page .textLayer span.markedContent{top:0;height:0}
.pdfr-page .textLayer ::selection{background:color-mix(in srgb,#2f7cf6 38%,transparent)}
.pdfr-page .textLayer br::selection{background:transparent}
.pdfr-page .textLayer .endOfContent{display:block;position:absolute;inset:100% 0 0;z-index:-1;cursor:default;-webkit-user-select:none;user-select:none}
.pdfr-page .textLayer .endOfContent.active{top:0}
.pdfr-center{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:24px;text-align:center;color:var(--dsw-alias-label-secondary)}
.pdfr-btn{height:30px;padding:0 14px;display:inline-flex;align-items:center;justify-content:center;gap:6px;border-radius:8px;border:1px solid var(--dsw-alias-border-l2);background:color-mix(in srgb,var(--dsw-alias-label-primary) 6%,transparent);color:var(--dsw-alias-label-primary);font:inherit;font-weight:500;cursor:pointer}
.pdfr-btn:hover{background:color-mix(in srgb,var(--dsw-alias-label-primary) 12%,transparent)}
.pdfr-btn:active{transform:translateY(.5px)}
.pdfr-actions{position:fixed;z-index:1000;pointer-events:auto;box-sizing:border-box;display:flex;align-items:center;gap:2px;height:48px;padding:6px 8px;max-width:calc(100vw - 16px);border:.5px solid var(--dsw-alias-border-l2);border-radius:14px;background:var(--dsw-alias-bg-overlay);color:var(--dsw-alias-label-primary);box-shadow:0 8px 28px rgba(0,0,0,.18),0 1px 3px rgba(0,0,0,.12);font-size:14px;line-height:1.4;user-select:none;-webkit-user-select:none}
.pdfr-send{flex:0 1 auto;min-width:0;display:inline-flex;align-items:center;gap:8px;height:36px;padding:0 12px;border:none;border-radius:10px;background:none;color:inherit;font:inherit;white-space:nowrap;cursor:pointer}
.pdfr-send:hover,.pdfr-send[aria-expanded=true]{background:color-mix(in srgb,var(--dsw-alias-label-primary) 8%,transparent)}
.pdfr-send:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:-2px}
.pdfr-send-label{min-width:0;max-width:160px;overflow:hidden;text-overflow:ellipsis}
.pdfr-actions-sep{flex:none;width:1px;height:24px;margin:0 4px 0 8px;background:var(--dsw-alias-border-l2)}
.pdfr-send-more{padding:0 8px}
.pdfr-actions-menu{position:absolute;right:0;z-index:1;overflow-y:auto;box-sizing:border-box;display:flex;flex-direction:column;gap:2px;width:max-content;max-width:calc(100vw - 16px);padding:6px;border:.5px solid var(--dsw-alias-border-l2);border-radius:14px;background:var(--dsw-alias-bg-overlay);box-shadow:0 8px 28px rgba(0,0,0,.18),0 1px 3px rgba(0,0,0,.12)}
.pdfr-actions-menu[data-side=below]{top:calc(100% + 6px)}
.pdfr-actions-menu[data-side=above]{bottom:calc(100% + 6px)}
.pdfr-actions-menu .pdfr-send{width:100%;max-width:none;justify-content:flex-start}
.pdfr-toast{position:fixed;z-index:1000;pointer-events:auto;display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 12px 0 10px;border-radius:999px;font:inherit;font-size:13px;white-space:nowrap;box-shadow:0 4px 14px rgba(0,0,0,.22)}
.pdfr-set{box-sizing:border-box;display:flex;flex-direction:column;gap:12px;padding:6px 8px 16px;color:var(--dsw-alias-label-primary);font-size:13px;line-height:1.5}
.pdfr-set p{margin:0;color:var(--dsw-alias-label-secondary)}
.pdfr-set-top{display:flex;flex-wrap:wrap;gap:8px}
.pdfr-card{display:flex;flex-direction:column;gap:10px;padding:12px 14px;border:.5px solid var(--dsw-alias-border-l2);border-radius:12px;background:var(--dsw-alias-bg-layer-1)}
.pdfr-card-head{display:flex;align-items:center;gap:4px}
.pdfr-card{position:relative}
.pdfr-card-summary{flex:1;min-width:0;display:flex;align-items:center;gap:8px}
.pdfr-card-summary>.pdfr-btn-icon{color:var(--dsw-alias-label-secondary)}
.pdfr-card-text{min-width:0;display:flex;flex-direction:column}
.pdfr-card-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500}
.pdfr-card-name[data-empty=true]{color:var(--dsw-alias-state-error-primary)}
.pdfr-card-sub{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-secondary);font-size:12px}
.pdfr-group{display:flex;flex-direction:column;gap:10px;padding:2px 0}
.pdfr-group-title{display:flex;align-items:baseline;gap:6px;color:var(--dsw-alias-label-secondary);font-size:12px;font-weight:600}
.pdfr-group-count{font-weight:400;opacity:.8}
.pdfr-group-empty{padding:16px 12px;border:1px dashed var(--dsw-alias-border-l2);border-radius:12px;color:var(--dsw-alias-label-secondary);font-size:12px;text-align:center}
.pdfr-group[data-drop=empty] .pdfr-group-empty{border-color:var(--dsw-alias-brand-primary);background:color-mix(in srgb,var(--dsw-alias-brand-primary) 8%,transparent)}
.pdfr-btn-primary{border-color:var(--dsw-alias-label-primary);background:var(--dsw-alias-label-primary);color:var(--dsw-alias-bg-base)}
.pdfr-btn-primary:hover{background:color-mix(in srgb,var(--dsw-alias-label-primary) 88%,var(--dsw-alias-bg-base))}
.pdfr-btn:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}
.pdfr-modal{position:fixed;inset:0;z-index:900;display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;background:rgba(0,0,0,.45)}
.pdfr-dialog{box-sizing:border-box;width:100%;max-width:380px;max-height:100%;overflow:auto;display:flex;flex-direction:column;gap:12px;padding:16px;border:.5px solid var(--dsw-alias-border-l2);border-radius:14px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);box-shadow:0 16px 48px rgba(0,0,0,.35)}
.pdfr-dialog-title{margin:0;font-size:14px;font-weight:600}
.pdfr-dialog-foot{display:flex;justify-content:flex-end;gap:8px;margin-top:2px}
.pdfr-card[data-dragging=true]{opacity:.45}
.pdfr-card[data-drop=before]::before,.pdfr-card[data-drop=after]::after{content:"";position:absolute;left:0;right:0;height:2px;border-radius:2px;background:var(--dsw-alias-brand-primary);pointer-events:none}
.pdfr-card[data-drop=before]::before{top:-7px}
.pdfr-card[data-drop=after]::after{bottom:-7px}
.pdfr-grip{cursor:grab;touch-action:none}
.pdfr-grip:active{cursor:grabbing}
.pdfr-grip:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}
.pdfr-field{display:flex;flex-direction:column;gap:4px}
.pdfr-field>span:not(.pdfr-select),.pdfr-field>label{color:var(--dsw-alias-label-secondary);font-size:12px}
.pdfr-input{box-sizing:border-box;width:100%;padding:6px 10px;border:.5px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:inherit;outline:none}
.pdfr-input:focus{border-color:var(--dsw-alias-brand-primary)}
.pdfr-input[aria-invalid=true]{border-color:var(--dsw-alias-state-error-primary)}
textarea.pdfr-input{resize:vertical;min-height:54px}
.pdfr-select{position:relative;display:block}
.pdfr-select select.pdfr-input{appearance:none;-webkit-appearance:none;padding-right:30px;cursor:pointer}
.pdfr-select>svg{position:absolute;right:10px;top:50%;transform:translateY(-50%);color:var(--dsw-alias-label-secondary);pointer-events:none}
.pdfr-name-row{display:flex;align-items:center;gap:6px}
.pdfr-name-row .pdfr-input{flex:1;min-width:0}
.pdfr-pick{position:relative;flex:none}
.pdfr-pick-trigger{display:inline-flex;align-items:center;gap:2px;height:31px;padding:0 6px 0 8px;border:.5px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:inherit;cursor:pointer}
.pdfr-pick-trigger:hover{background:color-mix(in srgb,var(--dsw-alias-label-primary) 5%,var(--dsw-alias-bg-base))}
.pdfr-pick-trigger[aria-expanded=true]{border-color:var(--dsw-alias-brand-primary)}
.pdfr-pick-trigger:focus-visible,.pdfr-pick-item:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}
.pdfr-pick-list{position:absolute;z-index:20;top:calc(100% + 4px);left:0;display:grid;grid-template-columns:repeat(5,32px);gap:2px;padding:4px;border:.5px solid var(--dsw-alias-border-l2);border-radius:10px;background:var(--dsw-alias-bg-overlay);box-shadow:0 8px 24px rgba(0,0,0,.18)}
.pdfr-pick-item{display:flex;align-items:center;justify-content:center;width:32px;height:32px;padding:0;border:0;border-radius:6px;background:none;color:var(--dsw-alias-label-primary);font:inherit;cursor:pointer}
.pdfr-pick-item:hover{background:color-mix(in srgb,var(--dsw-alias-label-primary) 7%,transparent)}
.pdfr-pick-item[aria-selected=true]{color:var(--dsw-alias-brand-primary);background:color-mix(in srgb,var(--dsw-alias-brand-primary) 10%,transparent)}
.pdfr-field>.pdfr-field-hint{opacity:.75}
.pdfr-field-error{color:var(--dsw-alias-state-error-primary);font-size:12px}
.pdfr-toast{background:var(--dsw-alias-bg-overlay);color:var(--dsw-alias-label-primary);border:.5px solid var(--dsw-alias-border-l2)}
.pdfr-toast[data-tone=error]{color:var(--dsw-alias-state-error-primary)}
.pdfr-toast[data-tone=ok] svg{color:var(--dsw-alias-state-success-primary)}
`;

    function svg(size, className, children) {
      return h('svg', {
        width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
        strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', className, 'aria-hidden': true,
        style: { display: 'block', flex: 'none' },
      }, children);
    }
    const paths = (...ds) => ds.map((d) => ['path', { d }]);
    const fileText = paths('M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z', 'M14 2v5a1 1 0 0 0 1 1h5', 'M10 9H8', 'M16 13H8', 'M16 17H8');
    /**
     * Every icon as [tag, attributes] shapes on a 24x24 grid. Most are Lucide (https://lucide.dev, ISC,
     * lucide-static v1.70.0; see LICENSE.lucide.txt); `pdf` and the small control marks are drawn here.
     */
    const ICONS = {
      /* icons a send button can choose (see ICON_ORDER), plus `ban` for the picker's 'none' */
      send: [...paths('M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z', 'm21.854 2.147-10.94 10.939')],
      insert: paths('M12 20h-1a2 2 0 0 1-2-2 2 2 0 0 1-2 2H6', 'M13 8h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-7', 'M5 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1', 'M6 4h1a2 2 0 0 1 2 2 2 2 0 0 1 2-2h1', 'M9 6v12'),
      translate: paths('m5 8 6 6', 'm4 14 6-6 2-3', 'M2 5h12', 'M7 2h1', 'm22 22-5-10-5 10', 'M14 18h6'),
      summary: fileText,
      explain: paths('M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5', 'M9 18h6', 'M10 22h4'),
      question: paths('M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719', 'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3', 'M12 17h.01'),
      copy: [['rect', { width: 14, height: 14, x: 8, y: 8, rx: 2, ry: 2 }], ...paths('M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2')],
      bookmark: paths('M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z'),
      sparkle: [...paths('M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z', 'M20 2v4', 'M22 4h-4'), ['circle', { cx: 4, cy: 20, r: 2 }]],
      edit: paths('M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z', 'm15 5 4 4'),
      search: [...paths('m21 21-4.34-4.34'), ['circle', { cx: 11, cy: 11, r: 8 }]],
      code: paths('m18 16 4-4-4-4', 'm6 8-4 4 4 4', 'm14.5 4-5 16'),
      ban: [['circle', { cx: 12, cy: 12, r: 10 }], ...paths('M4.929 4.929 19.07 19.071')],
      /* file kinds */
      fileText,
      bookOpen: paths('M12 5v16', 'M20.001 19A2 2 0 0 0 22 17V5a2 2 0 0 0-1.999-2L16 3.002A5 5 0 0 0 12 5a5 5 0 0 0-4-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 1.999 2H8a5 5 0 0 1 4 2 5 5 0 0 1 4-2z'),
      spreadsheet: paths('M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z', 'M14 2v5a1 1 0 0 0 1 1h5', 'M8 13h2', 'M14 13h2', 'M8 17h2', 'M14 17h2'),
      alignLeft: paths('M21 5H3', 'M15 12H3', 'M17 19H3'),
      /* interface */
      history: paths('M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8', 'M3 3v5h5', 'M12 7v5l4 2'),
      settings: [...paths('M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915'), ['circle', { cx: 12, cy: 12, r: 3 }]],
      arrowLeft: paths('m12 19-7-7 7-7', 'M19 12H5'),
      trash: paths('M10 11v6', 'M14 11v6', 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6', 'M3 6h18', 'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'),
      grip: [[9, 12], [9, 5], [9, 19], [15, 12], [15, 5], [15, 19]].map(([cx, cy]) => ['circle', { cx, cy, r: 1 }]),
      chevronDown: paths('m6 9 6 6 6-6'),
      upload: paths('M12 16V4M7 9l5-5 5 5', 'M5 20h14'),
      rotateCcw: paths('M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8', 'M3 3v5h5'),
      refresh: paths('M20 11a8 8 0 1 0-2.3 5.7', 'M20 4v7h-7'),
      check: paths('m5 12 5 5 9-10'),
      plus: paths('M12 5v14M5 12h14'),
      minus: paths('M5 12h14'),
      fit: paths('M4 8V5h3M20 8V5h-3M4 16v3h3M20 16v3h-3'),
      list: paths('M3 5h.01', 'M3 12h.01', 'M3 19h.01', 'M8 5h13', 'M8 12h13', 'M8 19h13'),
      eye: [...paths('M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0'), ['circle', { cx: 12, cy: 12, r: 3 }]],
      eyeOff: paths('M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49', 'M14.084 14.158a3 3 0 0 1-4.242-4.242', 'M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143', 'm2 2 20 20'),
    };
    /** Icons a send button can choose, in picker order; 'none' (drawn with `ban` in the picker) shows nothing. */
    const ICON_ORDER = ['send', 'insert', 'translate', 'summary', 'explain', 'question', 'copy', 'bookmark', 'sparkle', 'edit', 'search', 'code'];
    function Icon(props) {
      return svg(props.size || 15, props.className, ICONS[props.name].map(([tag, attrs], index) => h(tag, { key: index, ...attrs })));
    }
    /** Icon of a file kind in the upload history. */
    const FILE_KIND_ICONS = { epub: 'bookOpen', sheet: 'spreadsheet', table: 'spreadsheet', text: 'alignLeft' };
    /** The DeepRead logo: a black four-point star and five text lines on a white rounded square (350x350 grid). */
    const LOGO = [{"d":"M350 112C350 72.7963 350 53.1945 342.37 38.2207C335.659 25.0493 324.951 14.3407 311.779 7.62954C296.806 0 277.204 0 238 0H112C72.7963 0 53.1945 0 38.2207 7.62954C25.0493 14.3407 14.3407 25.0493 7.62955 38.2207C0 53.1945 0 72.7963 0 112V238C0 277.204 0 296.806 7.62955 311.779C14.3407 324.951 25.0493 335.659 38.2207 342.37C53.1945 350 72.7963 350 112 350H238C277.204 350 296.806 350 311.779 342.37C324.951 335.659 335.659 324.951 342.37 311.779C350 296.806 350 277.204 350 238V112Z","fill":"white"},{"d":"M278 185C283.523 185 288 180.523 288 175C288 169.477 283.523 165 278 165H252C246.477 165 242 169.477 242 175C242 180.523 246.477 185 252 185H278Z","fill":"black"},{"d":"M278 100C283.523 100 288 95.5228 288 90C288 84.4772 283.523 80 278 80H177C171.477 80 167 84.4772 167 90C167 95.5228 171.477 100 177 100H278Z","fill":"black"},{"d":"M278 270C283.523 270 288 265.523 288 260C288 254.477 283.523 250 278 250H177C171.477 250 167 254.477 167 260C167 265.523 171.477 270 177 270H278Z","fill":"black"},{"d":"M278 142C283.523 142 288 137.523 288 132C288 126.477 283.523 122 278 122H209C203.477 122 199 126.477 199 132C199 137.523 203.477 142 209 142H278Z","fill":"black"},{"d":"M278 228C283.523 228 288 223.523 288 218C288 212.477 283.523 208 278 208H209C203.477 208 199 212.477 199 218C199 223.523 203.477 228 209 228H278Z","fill":"black"},{"d":"M122.481 91.3498C123.395 83.9724 127.99 80 133.5 80C139.01 80 143.605 83.9724 144.519 91.3498C159.212 146.923 162.077 149.788 217.65 164.481C225.028 165.395 229 169.99 229 175.5C229 181.01 225.028 185.605 217.65 186.519C162.077 201.212 159.212 204.077 144.519 259.65C143.605 267.028 139.01 271 133.5 271C127.99 271 123.395 267.028 122.481 259.65C107.788 204.077 104.923 201.212 49.3498 186.519C41.9724 185.605 38 181.01 38 175.5C38 169.99 41.9724 165.395 49.3498 164.481C104.923 149.788 107.788 146.923 122.481 91.3498Z","fill":"black"}];
    function LogoGlyph(props) {
      const size = (props && props.size) || 18;
      return h('svg', {
        width: size, height: size, viewBox: '0 0 350 350', fill: 'none', className: props && props.className,
        'aria-hidden': true, style: { display: 'block', flex: 'none' },
      }, LOGO.map((attrs, index) => h('path', { key: index, ...attrs })));
    }
    /** A button's icon by id; an unknown id falls back to the send arrow and 'none' draws nothing. */
    function ButtonIcon(props) {
      if (props.icon === 'none') return null;
      const id = ICON_ORDER.includes(props.icon) ? props.icon : 'send';
      return h('span', { className: 'pdfr-btn-icon', 'data-icon': id, style: { display: 'inline-flex' } }, h(Icon, { name: id, size: props.size }));
    }
    /** Icon-only button; `label` is both the tooltip and the accessible name unless `title` / `aria-label` override it. */
    function IconButton(props) {
      const { label, className, ...rest } = props;
      return h('button', { type: 'button', className: className ? 'pdfr-icon-btn ' + className : 'pdfr-icon-btn', title: label, 'aria-label': label, ...rest });
    }

    const ADDRESS_PREFIX = 'dsh-resource://deepread/';
    /** Address of one stored PDF; the file name rides along so a restored tab can title itself synchronously. */
    function storedAddress(id, name) {
      return ADDRESS_PREFIX + encodeURIComponent(id) + '/' + encodeURIComponent(name);
    }
    /** Read a stored-PDF address back into its id and file name; undefined for any other address. */
    function parseAddress(address) {
      try {
        if (typeof address !== 'string' || !address.startsWith(ADDRESS_PREFIX)) return undefined;
        const [id, name] = address.slice(ADDRESS_PREFIX.length).split('?')[0].split('/');
        if (!id || !name) return undefined;
        return { id: decodeURIComponent(id), name: decodeURIComponent(name) };
      } catch (error) {
        return undefined;
      }
    }
    const TEXT_EXTENSIONS = new Set(['txt', 'md']);
    const TABLE_EXTENSIONS = { csv: ',' };
    const SHEET_EXTENSIONS = new Set(['xlsx', 'xls']);
    const ACCEPT = ['pdf', 'epub'].concat(Array.from(TEXT_EXTENSIONS), Object.keys(TABLE_EXTENSIONS), Array.from(SHEET_EXTENSIONS)).map((ext) => '.' + ext).join(',');
    function extensionOf(name) {
      const match = /\.([A-Za-z0-9]+)$/.exec(String(name || ''));
      return match ? match[1].toLowerCase() : '';
    }
    /** 'pdf' | 'epub' | 'sheet' | 'table' | 'text', or undefined for a format the reader cannot show. */
    function fileKind(name) {
      const ext = extensionOf(name);
      if (ext === 'pdf') return 'pdf';
      if (ext === 'epub') return 'epub';
      if (SHEET_EXTENSIONS.has(ext)) return 'sheet';
      if (TABLE_EXTENSIONS[ext]) return 'table';
      if (TEXT_EXTENSIONS.has(ext)) return 'text';
      return undefined;
    }
    /** UTF-8 first; legacy Chinese text files are usually GB18030. */
    function decodeText(buffer) {
      const bytes = new Uint8Array(buffer);
      try {
        return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
      } catch (error) {
        try {
          return new TextDecoder('gb18030').decode(bytes);
        } catch (fallback) {
          return new TextDecoder().decode(bytes);
        }
      }
    }
    /** Minimal RFC 4180 parser: quoted cells, doubled quotes, CRLF; stops after maxRows rows. */
    function parseDelimited(text, delimiter, maxRows) {
      const rows = [];
      let row = [];
      let cell = '';
      let quoted = false;
      let i = 0;
      const n = text.length;
      while (i < n) {
        const c = text[i];
        if (quoted) {
          if (c === '"') {
            if (text[i + 1] === '"') { cell += '"'; i += 2; continue; }
            quoted = false;
            i += 1;
            continue;
          }
          cell += c;
          i += 1;
          continue;
        }
        if (c === '"' && cell === '') { quoted = true; i += 1; continue; }
        if (c === delimiter) { row.push(cell); cell = ''; i += 1; continue; }
        if (c === '\n' || c === '\r') {
          if (c === '\r' && text[i + 1] === '\n') i += 1;
          row.push(cell);
          rows.push(row);
          row = [];
          cell = '';
          i += 1;
          if (rows.length >= maxRows) return { rows, truncated: i < n };
          continue;
        }
        cell += c;
        i += 1;
      }
      if (cell !== '' || row.length > 0) {
        row.push(cell);
        rows.push(row);
      }
      return { rows, truncated: false };
    }
    function formatSize(bytes) {
      if (typeof bytes !== 'number') return '';
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(bytes < 10240 ? 1 : 0) + ' KB';
      return (bytes / 1024 / 1024).toFixed(1) + ' MB';
    }
    /** When a file was added, as short relative text; older than a week falls back to a plain date. */
    function formatAge(timestamp, t, now) {
      if (typeof timestamp !== 'number') return '';
      const diff = now - timestamp;
      const minute = 60 * 1000;
      const hour = 60 * minute;
      const day = 24 * hour;
      if (diff < minute) return t('history.justNow');
      if (diff < hour) return t('history.minutesAgo', { count: Math.floor(diff / minute) });
      if (diff < day) return t('history.hoursAgo', { count: Math.floor(diff / hour) });
      if (diff < 2 * day) return t('history.yesterday');
      if (diff < 7 * day) return t('history.daysAgo', { count: Math.floor(diff / day) });
      const date = new Date(timestamp);
      const sameYear = date.getFullYear() === new Date(now).getFullYear();
      try {
        return date.toLocaleDateString(undefined, sameYear ? { month: 'numeric', day: 'numeric' } : { year: 'numeric', month: 'numeric', day: 'numeric' });
      } catch (error) {
        return date.toISOString().slice(0, 10);
      }
    }
    function describe(error, fallback) {
      const message = error && error.message ? String(error.message) : '';
      return message ? fallback + ': ' + message : fallback;
    }
    function lookup(name) {
      const ctx = runtime.ctx;
      if (!ctx) return undefined;
      try {
        const found = ctx.get(name);
        if (found !== undefined) return found;
      } catch (error) {
        /* fall through to property access */
      }
      try {
        return ctx[name];
      } catch (error) {
        return undefined;
      }
    }

    /** Shows a render or effect failure inside the panel instead of leaving it blank. */
    class Boundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { error: null };
      }
      static getDerivedStateFromError(error) {
        return { error };
      }
      componentDidCatch(error) {
        console.error('deepread: panel crashed', error);
      }
      render() {
        if (this.state.error) {
          return h('div', { className: 'pdfr-center', role: 'alert' }, [
            h('div', { key: 'm' }, 'DeepRead: ' + (this.state.error.message || String(this.state.error))),
            h('button', { key: 'b', type: 'button', className: 'pdfr-btn', onClick: () => this.setState({ error: null }) }, 'Retry'),
          ]);
        }
        return this.props.children;
      }
    }
    function guarded(Component) {
      return function Guarded(props) {
        return h(Boundary, null, h(Component, props));
      };
    }


    /** Run `load` once and reuse its promise; a failed attempt is forgotten so the next call retries. */
    function memoizeAsync(load) {
      let promise;
      return () => {
        if (!promise) {
          promise = load();
          promise.catch(() => {
            promise = undefined;
          });
        }
        return promise;
      };
    }
    /** Minimal change notification shared by the two stores below. */
    function createEmitter() {
      const listeners = new Set();
      return {
        subscribe(listener) {
          listeners.add(listener);
          return () => listeners.delete(listener);
        },
        emit(...args) {
          listeners.forEach((listener) => listener(...args));
        },
      };
    }
    /** Book pages render inside iframes, where the frame-wide selection listeners cannot see; the reader reports through here. */
    const readerFrames = new Set();
    const frameEvents = createEmitter();
    function newId() {
      return crypto.randomUUID ? crypto.randomUUID() : 'b' + Date.now() + Math.random().toString(16).slice(2);
    }

    /** Uploaded files live in this browser's IndexedDB: metadata for the history list, bytes for reopening. */
    const DB_NAME = 'deepread';
    const STORE_NAME = 'pdfs';
    const openDb = memoizeAsync(() => new Promise((resolve, reject) => {
      if (typeof indexedDB === 'undefined') {
        reject(new Error(tr('error.storage')));
        return;
      }
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore(STORE_NAME, { keyPath: 'id' });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error(tr('error.storage')));
    }));
    async function withStore(mode, run) {
      const db = await openDb();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, mode);
        let result;
        try {
          result = run(transaction.objectStore(STORE_NAME));
        } catch (error) {
          reject(error);
          return;
        }
        transaction.oncomplete = () => resolve(result && 'result' in result ? result.result : undefined);
        transaction.onerror = () => reject(transaction.error);
        transaction.onabort = () => reject(transaction.error || new Error('aborted'));
      });
    }
    const history = {
      ...createEmitter(),
      /** Every stored file without its bytes, newest first. */
      async list() {
        const rows = await withStore('readonly', (store) => store.getAll());
        return (rows || [])
          .map((row) => ({ id: row.id, name: row.name, size: row.size, addedAt: row.addedAt }))
          .sort((a, b) => b.addedAt - a.addedAt);
      },
      async add(file) {
        const bytes = await file.arrayBuffer();
        const entry = { id: newId(), name: file.name, size: file.size, addedAt: Date.now(), bytes };
        await withStore('readwrite', (store) => store.put(entry));
        this.emit();
        return { id: entry.id, name: entry.name, size: entry.size, addedAt: entry.addedAt };
      },
      async bytes(id) {
        const row = await withStore('readonly', (store) => store.get(id));
        return row ? row.bytes : undefined;
      },
      async remove(id) {
        await withStore('readwrite', (store) => store.delete(id));
        this.emit();
      },
      async clear() {
        await withStore('readwrite', (store) => store.clear());
        this.emit();
      },
    };

    /** Send buttons shown beside a selection; user-defined and kept in this browser's localStorage. */
    const BUTTONS_KEY = 'deepread.buttons.v1';
    function defaultButtons() {
      return [
        { id: 'translate', name: tr('send.translate'), action: 'send', icon: 'translate', after: tr('send.translate.after') },
        { id: 'explain', name: tr('send.explain'), action: 'send', icon: 'explain', after: tr('send.explain.after') },
        { id: 'summary', name: tr('send.summary'), action: 'send', icon: 'summary', after: tr('send.summary.after') },
        { id: 'copy', name: tr('send.copy'), action: 'copy', icon: 'copy', after: '' },
        { id: 'insert', name: tr('send.toComposer'), action: 'insert', icon: 'insert', after: '' },
      ];
    }
    /** Normalize one stored or edited button; a missing `folded` means it stays on the toolbar. */
    function cleanButton(raw) {
      if (!raw || typeof raw !== 'object') return null;
      return {
        id: typeof raw.id === 'string' && raw.id ? raw.id : newId(),
        name: typeof raw.name === 'string' ? raw.name.slice(0, MAX_NAME) : '',
        action: raw.action === 'send' || raw.action === 'copy' ? raw.action : 'insert',
        icon: raw.icon === 'none' || ICON_ORDER.includes(raw.icon) ? raw.icon : 'send',
        after: typeof raw.after === 'string' ? raw.after : '',
        folded: raw.folded === true,
      };
    }
    const buttons = {
      ...createEmitter(),
      saved: null,
      loaded: false,
      load() {
        if (this.loaded) return;
        this.loaded = true;
        try {
          const text = localStorage.getItem(BUTTONS_KEY);
          const parsed = text ? JSON.parse(text) : null;
          const list = Array.isArray(parsed) ? parsed.map(cleanButton).filter(Boolean) : null;
          this.saved = list && list.length > 0 ? list : null;
        } catch (error) {
          this.saved = null;
        }
      },
      /** The buttons in force: the saved list, or the five built-in ones until the user edits. */
      get() {
        this.load();
        return this.saved || defaultButtons();
      },
      isCustom() {
        this.load();
        return this.saved !== null;
      },
      /** Save a list; an empty one clears the saved copy and brings the built-in buttons back. */
      set(list) {
        this.loaded = true;
        this.saved = list.map(cleanButton).filter(Boolean);
        if (this.saved.length === 0) this.saved = null;
        try {
          if (this.saved) localStorage.setItem(BUTTONS_KEY, JSON.stringify(this.saved));
          else localStorage.removeItem(BUTTONS_KEY);
        } catch (error) {
          console.error('deepread: cannot save buttons', error);
        }
        this.emit();
      },
      reset() {
        this.set([]);
      },
    };
    /** Re-read the saved list when another tab or window changes it. */
    function watchButtonStorage() {
      const onStorage = (event) => {
        if (event.key !== null && event.key !== BUTTONS_KEY) return;
        buttons.loaded = false;
        buttons.emit();
      };
      window.addEventListener('storage', onStorage);
      return () => window.removeEventListener('storage', onStorage);
    }
    function useButtons() {
      const [, tick] = useState(0);
      useEffect(() => buttons.subscribe(() => tick((n) => n + 1)), []);
      return buttons.get();
    }
    /** Write text to the clipboard; falls back to execCommand where the async API is unavailable. */
    async function copyToClipboard(text) {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
          return true;
        }
      } catch (error) {
        // fall through to the legacy path
      }
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
      document.body.appendChild(area);
      try {
        area.select();
        return !!document.execCommand('copy');
      } catch (error) {
        return false;
      } finally {
        area.remove();
      }
    }
    /** Join the selection and the prompt after it, each on its own line; empty parts are skipped. */
    function composeMessage(button, selected) {
      return [selected, button.action === 'copy' ? '' : button.after]
        .map((part) => (typeof part === 'string' ? part.trim() : ''))
        .filter(Boolean)
        .join('\n');
    }

    /** Load PDF.js once, with its worker served from a Blob URL built from the packaged worker chunk. */
    const loadPdfjs = memoizeAsync(async () => {
      const loader = runtime.require;
      const lib = await loader.async('./client.pdfjs.js');
      const worker = await loader.async('./client.pdfjs-worker.js');
      const url = URL.createObjectURL(new Blob([worker.source], { type: 'text/javascript' }));
      lib.GlobalWorkerOptions.workerSrc = url;
      if (runtime.ctx) runtime.ctx.effect(() => () => URL.revokeObjectURL(url), 'deepread.worker-url');
      return lib;
    });
    /** Load one packaged library chunk (SheetJS, JSZip) once; a failed load can be retried. */
    const chunkLoaders = {};
    function loadChunk(file) {
      if (!chunkLoaders[file]) chunkLoaders[file] = memoizeAsync(() => Promise.resolve(runtime.require.async(file)));
      return chunkLoaders[file]();
    }

    /** Drop zone and file chooser; calls `onFiles` with the chosen or dropped files. */
    function UploadBox(props) {
      const { t, busy, onFiles } = props;
      const inputRef = useRef(null);
      const [dragging, setDragging] = useState(false);
      const choose = () => inputRef.current && inputRef.current.click();
      return h(React.Fragment, null, [
        h('input', {
          key: 'in', ref: inputRef, type: 'file', accept: ACCEPT, multiple: true, hidden: true,
          onChange: (event) => {
            onFiles(event.target.files);
            event.target.value = '';
          },
        }),
        h('div', {
          key: 'up', className: 'pdfr-upload', role: 'button', tabIndex: 0, 'data-active': dragging, 'aria-busy': busy,
          onClick: choose,
          onKeyDown: (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              choose();
            }
          },
          onDragOver: (event) => { event.preventDefault(); setDragging(true); },
          onDragLeave: () => setDragging(false),
          onDrop: (event) => { event.preventDefault(); setDragging(false); onFiles(event.dataTransfer.files); },
        }, [
          h('span', { key: 'b', className: 'pdfr-upload-btn' }, [h(Icon, { key: 'g', name: 'upload' }), t('upload.button')]),
          h('span', { key: 'd' }, dragging ? t('upload.dropActive') : t('upload.drop')),
          h('span', { key: 'f', className: 'pdfr-upload-formats' }, t('upload.formats')),
        ]),
      ]);
    }

    /** The upload history: a count and "clear" in the heading, then one row per stored file. */
    function HistoryList(props) {
      const { t, entries, onOpen, onRemove, onClear } = props;
      const [now, setNow] = useState(() => Date.now());
      useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 60 * 1000);
        return () => clearInterval(timer);
      }, []);
      return h(React.Fragment, null, [
        h('div', { key: 'sec', className: 'pdfr-section' }, [
          h('span', { key: 't', className: 'pdfr-section-title' }, [
            t('history.title'),
            entries.length > 0 && h('span', { key: 'n', className: 'pdfr-section-count' }, String(entries.length)),
          ]),
          entries.length > 0 && h('button', { key: 'c', type: 'button', className: 'pdfr-link', onClick: onClear }, t('history.clear')),
        ]),
        h('div', { key: 'list', className: 'pdfr-list pdfr-list-files' }, entries.length === 0
          ? h('div', { className: 'pdfr-empty' }, [
            h('span', { key: 'i', className: 'pdfr-empty-icon' }, h(Icon, { name: 'history', size: 22 })),
            h('span', { key: 't' }, t('history.empty')),
          ])
          : h('div', { className: 'pdfr-files', role: 'list' }, entries.map((entry) => {
            const kind = fileKind(entry.name);
            const meta = [extensionOf(entry.name).toUpperCase() || '—', formatSize(entry.size), formatAge(entry.addedAt, t, now)].filter(Boolean);
            let when = '';
            try { when = new Date(entry.addedAt).toLocaleString(); } catch (error) { when = ''; }
            return h('div', { key: entry.id, className: 'pdfr-item', role: 'listitem' }, [
              h('button', {
                key: 'o', type: 'button', className: 'pdfr-item-open', title: entry.name + (when ? '\n' + when : ''),
                onClick: () => onOpen(entry),
              }, [
                h('span', { key: 'i', className: 'pdfr-badge', 'data-kind': kind || 'other' }, h(Icon, { name: FILE_KIND_ICONS[kind] || 'fileText', size: 20 })),
                h('span', { key: 'x', className: 'pdfr-item-text' }, [
                  h('span', { key: 'n', className: 'pdfr-item-name' }, entry.name),
                  h('span', { key: 'm', className: 'pdfr-item-meta' }, meta.join(' · ')),
                ]),
              ]),
              h(IconButton, {
                key: 'd', className: 'pdfr-item-del', label: t('history.remove'), 'aria-label': t('history.remove') + ': ' + entry.name,
                onClick: () => onRemove(entry),
              }, h(Icon, { name: 'trash' })),
            ]);
          }))),
      ]);
    }

    /** Right-sidebar page: upload a file, or reopen one from the upload history; the gear opens the button settings. */
    function PdfPickerTab(props) {
      const t = props.t || tr;
      const [entries, setEntries] = useState([]);
      const [error, setError] = useState('');
      const [busy, setBusy] = useState(false);
      const [view, setView] = useState('files');
      /** An error handler that shows `fallback` plus the failure's message in the page. */
      const report = (fallback) => (failure) => setError(describe(failure, fallback));

      const reload = useCallback(() => {
        history.list().then(setEntries, (failure) => setError(describe(failure, t('error.storage'))));
      }, [t]);
      useEffect(() => {
        reload();
        return history.subscribe(reload);
      }, [reload]);

      function openEntry(entry) {
        setError('');
        try {
          const result = lookup('sidebarRight').openResource(storedAddress(entry.id, entry.name), { kind: VIEWER_KIND });
          if (result && typeof result.catch === 'function') result.catch(report(t('error.open')));
        } catch (failure) {
          report(t('error.open'))(failure);
        }
      }

      async function upload(fileList) {
        const files = Array.from(fileList || []).filter((file) => fileKind(file.name) || file.type === 'application/pdf');
        if (files.length === 0) {
          if (fileList && fileList.length > 0) setError(t('upload.notPdf'));
          return;
        }
        setError('');
        setBusy(true);
        try {
          let last;
          for (const file of files) last = await history.add(file);
          if (last) openEntry(last);
        } catch (failure) {
          report(t('upload.failed'))(failure);
        } finally {
          setBusy(false);
        }
      }

      const inSettings = view === 'buttons';
      return h('div', { className: 'pdfr-root' }, [
        h('style', { key: 'css' }, CSS),
        h('div', { key: 'head', className: 'pdfr-head' }, [
          h('div', { key: 't', className: 'pdfr-title' }, inSettings
            ? [
              h(IconButton, { key: 'back', label: t('settings.back'), 'data-view': 'files', onClick: () => setView('files') }, h(Icon, { name: 'arrowLeft', size: 16 })),
              h('span', { key: 'n', className: 'pdfr-title-text' }, t('view.buttons')),
            ]
            : [
              h(LogoGlyph, { key: 'g', size: 24 }),
              h('span', { key: 'n', className: 'pdfr-title-text' }, t('tab.title')),
              h(IconButton, { key: 'cfg', className: 'pdfr-gear', label: t('view.buttons'), 'data-view': 'buttons', onClick: () => setView('buttons') }, h(Icon, { name: 'settings', size: 16 })),
            ]),
          !inSettings && h('p', { key: 'p', className: 'pdfr-hint' }, t('header.hint')),
        ]),
        inSettings
          ? h('div', { key: 'cfg', className: 'pdfr-list' }, h(ButtonsSettings, { t }))
          : [
            h(UploadBox, { key: 'up', t, busy, onFiles: upload }),
            error && h('div', { key: 'err', className: 'pdfr-error', role: 'alert' }, error),
            h(HistoryList, {
              key: 'history', t, entries, onOpen: openEntry,
              onRemove: (entry) => history.remove(entry.id).catch(report(t('error.storage'))),
              onClear: () => history.clear().catch(report(t('error.storage'))),
            }),
          ],
      ]);
    }

    /** Dropdown that picks a button's icon: a trigger showing the current icon, and a grid of icons (names as tooltips). */
    function IconPicker(props) {
      const { value, onChange, t } = props;
      const [open, setOpen] = useState(false);
      const root = useRef(null);
      const trigger = useRef(null);
      useEffect(() => {
        if (!open) return undefined;
        const onDown = (event) => {
          if (root.current && !root.current.contains(event.target)) setOpen(false);
        };
        const onKey = (event) => {
          if (event.key !== 'Escape') return;
          event.stopPropagation();
          setOpen(false);
          if (trigger.current) trigger.current.focus();
        };
        document.addEventListener('pointerdown', onDown, true);
        document.addEventListener('keydown', onKey, true);
        return () => {
          document.removeEventListener('pointerdown', onDown, true);
          document.removeEventListener('keydown', onKey, true);
        };
      }, [open]);
      const choose = (id) => {
        onChange(id);
        setOpen(false);
        if (trigger.current) trigger.current.focus();
      };
      const options = ['none', ...ICON_ORDER];
      const glyph = (id) => (id === 'none' ? h(Icon, { name: 'ban' }) : h(ButtonIcon, { icon: id }));
      const current = t('settings.icon') + ': ' + t('settings.icon.' + value);
      return h('div', { ref: root, className: 'pdfr-pick' }, [
        h('button', {
          key: 't', ref: trigger, type: 'button', className: 'pdfr-pick-trigger', 'data-icon-trigger': value,
          'aria-haspopup': 'listbox', 'aria-expanded': open,
          title: current, 'aria-label': current,
          onClick: () => setOpen((state) => !state),
        }, [h(React.Fragment, { key: 'g' }, glyph(value)), h(Icon, { key: 'v', name: 'chevronDown', size: 12 })]),
        open && h('div', { key: 'l', className: 'pdfr-pick-list', role: 'listbox', 'aria-label': t('settings.icon') },
          options.map((id) => h('button', {
            key: id, type: 'button', role: 'option', className: 'pdfr-pick-item', 'data-icon-choice': id,
            title: t('settings.icon.' + id), 'aria-label': t('settings.icon.' + id),
            'aria-selected': value === id, onClick: () => choose(id),
          }, glyph(id)))),
      ]);
    }

    /** Modal form for adding or editing one send button; nothing is saved until the user confirms. */
    function ButtonDialog(props) {
      const { t, mode, initial, onSave, onCancel } = props;
      const [draft, setDraft] = useState(initial);
      const [tried, setTried] = useState(false);
      const formRef = useRef(null);
      const nameRef = useRef(null);
      const uid = useRef('pdfr-dlg-' + Math.random().toString(36).slice(2, 8)).current;
      const change = (patch) => setDraft((prev) => ({ ...prev, ...patch }));
      const empty = draft.name.trim() === '';
      useEffect(() => {
        if (nameRef.current) nameRef.current.focus();
        const onKey = (event) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            onCancel();
          }
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
      }, []);
      const submit = (event) => {
        event.preventDefault();
        if (empty) {
          setTried(true);
          if (nameRef.current) nameRef.current.focus();
          return;
        }
        onSave({ ...draft, name: draft.name.trim() });
      };
      /** Keep Tab inside the dialog. */
      const trap = (event) => {
        if (event.key !== 'Tab' || !formRef.current) return;
        const nodes = [...formRef.current.querySelectorAll('button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])')];
        if (nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      };
      return h('div', {
        className: 'pdfr-modal', 'data-pdfr-modal': true,
        onMouseDown: (event) => { if (event.target === event.currentTarget) onCancel(); },
      }, h('form', {
        ref: formRef, className: 'pdfr-dialog', role: 'dialog', 'aria-modal': true, 'aria-labelledby': uid + '-t',
        noValidate: true, onSubmit: submit, onKeyDown: trap,
      }, [
        h('h3', { key: 't', id: uid + '-t', className: 'pdfr-dialog-title' }, t(mode === 'add' ? 'settings.dialog.add' : 'settings.dialog.edit')),
        h('div', { key: 'n', className: 'pdfr-field' }, [
          h('label', { key: 's', htmlFor: uid + '-n' }, t('settings.name')),
          h('div', { key: 'row', className: 'pdfr-name-row' }, [
            h(IconPicker, { key: 'ic', value: draft.icon, t, onChange: (icon) => change({ icon }) }),
            h('input', {
              key: 'in', ref: nameRef, id: uid + '-n', className: 'pdfr-input', value: draft.name, maxLength: MAX_NAME,
              placeholder: t('settings.namePlaceholder'), 'aria-invalid': tried && empty,
              onChange: (event) => change({ name: event.target.value }),
            }),
          ]),
        ]),
        tried && empty && h('div', { key: 'e', className: 'pdfr-field-error', role: 'alert' }, t('settings.nameRequired')),
        h('label', { key: 'a', className: 'pdfr-field' }, [
          h('span', { key: 's' }, t('settings.action')),
          h('span', { key: 'w', className: 'pdfr-select' }, [
            h('select', {
              key: 'sel', className: 'pdfr-input', value: draft.action,
              onChange: (event) => change({ action: event.target.value }),
            }, ACTIONS.map((action) => h('option', { key: action, value: action }, t('settings.action.' + action)))),
            h(Icon, { key: 'v', name: 'chevronDown', size: 14 }),
          ]),
        ]),
        draft.action !== 'copy' && h('label', { key: 'f', className: 'pdfr-field' }, [
          h('span', { key: 's' }, t('settings.after')),
          h('textarea', {
            key: 'ta', className: 'pdfr-input', value: draft.after, rows: 3, placeholder: t('settings.afterPlaceholder'),
            onChange: (event) => change({ after: event.target.value }),
          }),
          h('span', { key: 'h', className: 'pdfr-field-hint' }, t('settings.afterHint')),
        ]),
        h('div', { key: 'foot', className: 'pdfr-dialog-foot' }, [
          h('button', { key: 'c', type: 'button', className: 'pdfr-btn', onClick: onCancel }, t('settings.cancel')),
          h('button', { key: 's', type: 'submit', className: 'pdfr-btn pdfr-btn-primary' }, t('settings.save')),
        ]),
      ]));
    }

    /** A saved list split into the toolbar section and the fold-out menu section, each in saved order. */
    function splitGroups(list) {
      return { bar: list.filter((item) => !item.folded), menu: list.filter((item) => item.folded) };
    }
    /** The list with button `id` moved to insertion slot `slot` of `group`; null when that would change nothing. */
    function moveButton(list, id, group, slot) {
      const moved = list.find((item) => item.id === id);
      if (!moved) return null;
      const groups = splitGroups(list);
      let to = slot;
      if (Boolean(moved.folded) === (group === 'menu')) {
        const from = groups[group].findIndex((item) => item.id === id);
        if (from < slot) to = slot - 1;
        if (to === from) return null;
      }
      const rest = { bar: groups.bar.filter((item) => item.id !== id), menu: groups.menu.filter((item) => item.id !== id) };
      rest[group].splice(to, 0, { ...moved, folded: group === 'menu' });
      return [...rest.bar, ...rest.menu];
    }
    /** Where an arrow key sends button `id`: one step inside its section, or across the boundary at an edge. */
    function nudgeTarget(list, id, delta) {
      const moved = list.find((item) => item.id === id);
      if (!moved) return null;
      const groups = splitGroups(list);
      const group = moved.folded ? 'menu' : 'bar';
      const to = groups[group].findIndex((item) => item.id === id) + delta;
      if (to >= 0 && to < groups[group].length) return { group, slot: delta > 0 ? to + 1 : to };
      if (delta < 0 && group === 'menu') return { group: 'bar', slot: groups.bar.length };
      if (delta > 0 && group === 'bar') return { group: 'menu', slot: 0 };
      return null;
    }

    /** Settings page: add, edit, reorder and delete the selection send buttons. */
    function ButtonsSettings(props) {
      const t = props.t || tr;
      const list = useButtons();
      const custom = buttons.isCustom();
      const update = (id, patch) => buttons.set(list.map((item) => (item.id === id ? { ...item, ...patch } : item)));
      const [dialog, setDialog] = useState(null);
      const returnTo = useRef(null);
      const openDialog = (event, mode, item) => {
        returnTo.current = event.currentTarget;
        setDialog({ mode, item });
      };
      const closeDialog = () => {
        setDialog(null);
        const node = returnTo.current;
        returnTo.current = null;
        if (node && node.isConnected) node.focus();
      };
      const saveDialog = (item) => {
        if (dialog && dialog.mode === 'add') buttons.set([...list, item]);
        else update(item.id, item);
        closeDialog();
      };
      const [dragId, setDragId] = useState(null);
      const [dropAt, setDropAt] = useState(null);
      const dropRef = useRef(null);
      const focusId = useRef(null);
      const rootRef = useRef(null);

      const groups = splitGroups(list);
      const groupOf = (item) => (item.folded ? 'menu' : 'bar');
      /** Put button `id` into `group` at insertion slot `slot` (0..length of that group's current order). */
      const place = (id, group, slot) => {
        const next = moveButton(list, id, group, slot);
        if (next) buttons.set(next);
      };
      /** Keyboard move: within a group, and across the boundary between the two groups. */
      const nudge = (id, delta) => {
        const target = nudgeTarget(list, id, delta);
        focusId.current = target ? id : null;
        if (target) place(id, target.group, target.slot);
      };
      useEffect(() => {
        if (!focusId.current) return;
        const handle = rootRef.current && rootRef.current.querySelector('[data-button-id="' + focusId.current + '"] .pdfr-grip');
        focusId.current = null;
        if (handle) handle.focus();
      });
      const setDrop = (target) => {
        dropRef.current = target;
        setDropAt(target);
      };
      const endDrag = () => {
        setDragId(null);
        setDrop(null);
      };
      const onDragStart = (event, id) => {
        const dt = event.dataTransfer;
        if (dt) {
          dt.effectAllowed = 'move';
          try { dt.setData('text/plain', id); } catch (error) { /* some browsers refuse */ }
          const card = event.currentTarget.closest('.pdfr-card');
          if (card && dt.setDragImage) dt.setDragImage(card, 16, 16);
        }
        setDragId(id);
      };
      const onDragOver = (event) => {
        if (!dragId) return;
        event.preventDefault();
        if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
        const target = event.target && event.target.closest ? event.target : null;
        const section = target && target.closest('.pdfr-group');
        if (!section) return;
        const group = section.getAttribute('data-group');
        const card = target.closest('.pdfr-card');
        let slot = groups[group].length;
        if (card && card.closest('.pdfr-group') === section) {
          const index = groups[group].findIndex((item) => item.id === card.getAttribute('data-button-id'));
          if (index < 0) return;
          const box = card.getBoundingClientRect();
          slot = index + (event.clientY > box.top + box.height / 2 ? 1 : 0);
        }
        const current = dropRef.current;
        if (!current || current.group !== group || current.slot !== slot) setDrop({ group, slot });
      };
      const onDrop = (event) => {
        if (!dragId) return;
        event.preventDefault();
        const target = dropRef.current;
        if (target) place(dragId, target.group, target.slot);
        endDrag();
      };
      const remove = (id) => buttons.set(list.filter((item) => item.id !== id));
      const add = (event) => openDialog(event, 'add', { id: newId(), name: '', action: 'insert', icon: 'send', after: '', folded: false });

      /** The insertion slot to mark while dragging; nothing is marked where a drop would change nothing. */
      const dragged = dragId ? list.find((item) => item.id === dragId) : null;
      const dragGroup = dragged ? groupOf(dragged) : null;
      const dragFrom = dragged ? groups[dragGroup].findIndex((item) => item.id === dragId) : -1;
      const shown = dropAt && dragged && !(dropAt.group === dragGroup && (dropAt.slot === dragFrom || dropAt.slot === dragFrom + 1)) ? dropAt : null;

      const renderCard = (item, index, group) => {
        const count = groups[group].length;
        const empty = item.name.trim() === '';
        let drop;
        if (shown && shown.group === group) {
          if (shown.slot === index) drop = 'before';
          else if (shown.slot === count && index === count - 1) drop = 'after';
        }
        return h('div', {
          key: item.id, className: 'pdfr-card', 'data-button-id': item.id,
          'data-dragging': dragId === item.id, 'data-drop': drop,
        }, [
          h('div', { key: 'head', className: 'pdfr-card-head' }, [
            h(IconButton, {
              key: 'g', className: 'pdfr-grip', draggable: true, label: t('settings.drag'),
              onDragStart: (event) => onDragStart(event, item.id), onDragEnd: endDrag,
              onKeyDown: (event) => {
                if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                  event.preventDefault();
                  nudge(item.id, event.key === 'ArrowUp' ? -1 : 1);
                }
              },
            }, h(Icon, { name: 'grip', size: 16 })),
            h('div', { key: 'sum', className: 'pdfr-card-summary' }, [
              h(ButtonIcon, { key: 'ic', icon: item.icon, size: 16 }),
              h('div', { key: 'tx', className: 'pdfr-card-text' }, [
                h('span', { key: 'n', className: 'pdfr-card-name', 'data-empty': empty }, empty ? t('settings.unnamed') : item.name),
                h('span', { key: 'a', className: 'pdfr-card-sub' }, t('settings.action.' + item.action)),
              ]),
            ]),
            h(IconButton, {
              key: 'e', className: 'pdfr-edit', 'aria-haspopup': 'dialog', label: t('settings.edit'),
              onClick: (event) => openDialog(event, 'edit', item),
            }, h(ButtonIcon, { icon: 'edit', size: 15 })),
            h(IconButton, {
              key: 'x', disabled: list.length <= 1, label: t('settings.remove'),
              title: list.length <= 1 ? t('settings.removeLast') : t('settings.remove'), onClick: () => remove(item.id),
            }, h(Icon, { name: 'trash' })),
          ]),
        ]);
      };
      const renderGroup = (group) => {
        const items = groups[group];
        return h('div', {
          key: group, className: 'pdfr-group', role: 'group', 'data-group': group,
          'aria-label': t('settings.group.' + group),
          'data-drop': items.length === 0 && shown && shown.group === group ? 'empty' : undefined,
        }, [
          h('div', { key: 't', className: 'pdfr-group-title' }, [
            h('span', { key: 'n' }, t('settings.group.' + group)),
            h('span', { key: 'c', className: 'pdfr-group-count' }, String(items.length)),
          ]),
          ...items.map((item, index) => renderCard(item, index, group)),
          items.length === 0 && h('div', { key: 'e', className: 'pdfr-group-empty' }, t('settings.group.empty.' + group)),
        ]);
      };

      return h('div', { ref: rootRef, className: 'pdfr-set', onDragOver, onDrop }, [
        h('style', { key: 'css' }, CSS),
        h('p', { key: 'hint' }, t('settings.hint')),
        h('div', { key: 'top', className: 'pdfr-set-top' }, [
          h('button', { key: 'a', type: 'button', className: 'pdfr-btn pdfr-btn-primary', onClick: add }, [h(Icon, { key: 'i', name: 'plus' }), t('settings.add')]),
          custom && h('button', { key: 'r', type: 'button', className: 'pdfr-btn', onClick: () => buttons.reset() }, [h(Icon, { key: 'i', name: 'rotateCcw' }), t('settings.reset')]),
        ]),
        renderGroup('bar'),
        renderGroup('menu'),
        dialog && h(ButtonDialog, { key: 'dlg-' + dialog.item.id, t, mode: dialog.mode, initial: dialog.item, onSave: saveDialog, onCancel: closeDialog }),
      ]);
    }

    /** One PDF page: a canvas plus PDF.js's transparent text layer, drawn only while near the viewport. */
    function PdfPage(props) {
      const { pdf, pageNumber, size, scale, lib, observer } = props;
      const hostRef = useRef(null);
      const canvasRef = useRef(null);
      const textRef = useRef(null);
      const [near, setNear] = useState(false);
      const width = Math.floor(size.width * scale);
      const height = Math.floor(size.height * scale);

      useEffect(() => {
        const node = hostRef.current;
        if (!node || !observer) return undefined;
        observer.watch(node, setNear);
        return () => observer.unwatch(node);
      }, [observer]);

      useEffect(() => {
        const canvas = canvasRef.current;
        const textHost = textRef.current;
        if (!near) {
          if (canvas) {
            canvas.width = 0;
            canvas.height = 0;
          }
          if (textHost) textHost.replaceChildren();
          return undefined;
        }
        let cancelled = false;
        let renderTask;
        let textTask;
        (async () => {
          const page = await pdf.getPage(pageNumber);
          if (cancelled) return;
          const viewport = page.getViewport({ scale });
          const ratio = Math.min(window.devicePixelRatio || 1, Math.sqrt(MAX_CANVAS_PIXELS / (viewport.width * viewport.height)));
          canvas.width = Math.floor(viewport.width * ratio);
          canvas.height = Math.floor(viewport.height * ratio);
          const context = canvas.getContext('2d');
          renderTask = page.render({
            canvasContext: context,
            viewport,
            transform: ratio === 1 ? null : [ratio, 0, 0, ratio, 0, 0],
          });
          const content = await page.getTextContent();
          if (cancelled) return;
          textHost.replaceChildren();
          textHost.style.setProperty('--scale-factor', String(scale));
          textTask = lib.renderTextLayer({ textContentSource: content, container: textHost, viewport, textDivs: [] });
          const end = document.createElement('div');
          end.className = 'endOfContent';
          textHost.appendChild(end);
          await Promise.all([renderTask.promise, textTask.promise]);
        })().catch((error) => {
          if (error && error.name === 'RenderingCancelledException') return;
          if (!cancelled) console.error('deepread: page render failed', pageNumber, error);
        });
        return () => {
          cancelled = true;
          if (renderTask) renderTask.cancel();
          if (textTask) textTask.cancel();
        };
      }, [near, pdf, pageNumber, scale, lib]);

      /* PDF.js keeps the selection from jumping across empty space by activating an end-of-content sentinel. */
      const onDown = useCallback((event) => {
        const end = textRef.current && textRef.current.querySelector('.endOfContent');
        if (end && event.target !== textRef.current) end.classList.add('active');
      }, []);
      const onUp = useCallback(() => {
        const end = textRef.current && textRef.current.querySelector('.endOfContent');
        if (end) end.classList.remove('active');
      }, []);

      return h('div', {
        ref: hostRef, className: 'pdfr-page', 'data-page-number': pageNumber,
        style: { width, height, '--scale-factor': scale },
      }, [
        h('canvas', { key: 'c', ref: canvasRef }),
        h('div', { key: 't', ref: textRef, className: 'textLayer', onMouseDown: onDown, onMouseUp: onUp }),
      ]);
    }

    /** Shared IntersectionObserver so each page learns whether it is close enough to be worth drawing. */
    function useNearObserver(root) {
      const [observer, setObserver] = useState(null);
      useEffect(() => {
        if (!root) {
          setObserver(null);
          return undefined;
        }
        const callbacks = new Map();
        const io = new IntersectionObserver((entries) => {
          for (const entry of entries) {
            const callback = callbacks.get(entry.target);
            if (callback) callback(entry.isIntersecting);
          }
        }, { root, rootMargin: '900px 0px' });
        setObserver({
          watch(node, callback) { callbacks.set(node, callback); io.observe(node); },
          unwatch(node) { callbacks.delete(node); io.unobserve(node); },
        });
        return () => io.disconnect();
      }, [root]);
      return observer;
    }

    /** The stored file a viewer tab shows (decoded from the tab's address), plus its translator. */
    function useViewerTarget(props) {
      const info = props.useTabInfo ? props.useTabInfo() : undefined;
      const contentId = info && info.tab && info.tab.contentId;
      return { t: props.t || tr, target: useMemo(() => parseAddress(contentId), [contentId]) };
    }

    /**
     * Shared viewer layout: a toolbar (file name, optional meta text, `actions`, reload) and either a status
     * message (loading or failed, with retry) or the content in a scroll area. `below` sits under the toolbar once ready.
     */
    function ViewerFrame(props) {
      const { t, name, meta, state, ready, onReload, actions, below, loadingKey, scroll, children } = props;
      let body;
      if (state.phase === 'error') {
        body = h('div', { key: 'body', className: 'pdfr-center', role: 'alert' }, [
          h('div', { key: 'm' }, state.message),
          h('button', { key: 'b', type: 'button', className: 'pdfr-btn', onClick: onReload }, t('viewer.retry')),
        ]);
      } else if (state.phase === 'loading' || !ready) {
        body = h('div', { key: 'body', className: 'pdfr-center' }, t(loadingKey || 'viewer.loadingText'));
      } else {
        body = h('div', { key: 'body', className: 'pdfr-scroll pdfr-scroll-text', ...scroll }, children);
      }
      return h('div', { className: 'pdfr-viewer', 'data-pdf-reader': true }, [
        h('style', { key: 'css' }, CSS),
        h('div', { key: 'bar', className: 'pdfr-toolbar' }, [
          h('span', { key: 'n', className: 'pdfr-toolbar-name', title: name }, meta ? name + ' · ' + meta : name),
          actions,
          h(IconButton, { key: 'r', label: t('viewer.reload'), onClick: onReload }, h(Icon, { name: 'refresh' })),
        ]),
        state.phase === 'ready' && ready ? below : null,
        body,
      ]);
    }

    /** Loads a stored file's bytes and turns them into viewer data with `parse`; shared by the text, sheet and EPUB viewers. */
    function useStoredFile(target, reloadKey, parse, t) {
      const [state, setState] = useState({ phase: 'loading', message: '' });
      const [data, setData] = useState(null);
      useEffect(() => {
        if (!target) {
          setState({ phase: 'error', message: t('viewer.failedText') });
          return undefined;
        }
        let cancelled = false;
        setState({ phase: 'loading', message: '' });
        setData(null);
        (async () => {
          const stored = await history.bytes(target.id);
          if (cancelled) return;
          if (!stored) throw new Error(t('history.missing'));
          const parsed = await parse(stored, target);
          if (cancelled) return;
          setData(parsed);
          setState({ phase: 'ready', message: '' });
        })().catch((error) => {
          if (!cancelled) setState({ phase: 'error', message: describe(error, t('viewer.failedText')) });
        });
        return () => { cancelled = true; };
      }, [target && target.id, reloadKey]);
      return [state, data];
    }

    /** A table whose first row is the header. */
    function DataTable(props) {
      const { rows } = props;
      return h('table', { className: 'pdfr-table' }, [
        rows.length > 0 && h('thead', { key: 'h' }, h('tr', null, rows[0].map((cell, index) => h('th', { key: index }, cell)))),
        h('tbody', { key: 'b' }, rows.slice(1).map((row, r) => h('tr', { key: r }, row.map((cell, index) => h('td', { key: index }, cell))))),
      ]);
    }

    /** Right-sidebar PDF viewer: PDF.js canvas pages with a selectable text layer. */
    function PdfViewerTab(props) {
      const { t, target } = useViewerTarget(props);
      const [state, setState] = useState({ phase: 'loading', message: '' });
      const [doc, setDoc] = useState(null);
      const [sizes, setSizes] = useState([]);
      const [zoom, setZoom] = useState('fit');
      const [available, setAvailable] = useState(0);
      const [reloadKey, setReloadKey] = useState(0);
      const [scrollNode, setScrollNode] = useState(null);
      const observer = useNearObserver(scrollNode);
      const [lib, setLib] = useState(null);

      useEffect(() => {
        if (!target) {
          setState({ phase: 'error', message: t('viewer.failed') });
          return undefined;
        }
        let cancelled = false;
        let task;
        let loaded;
        setState({ phase: 'loading', message: '' });
        setDoc(null);
        setSizes([]);
        (async () => {
          const [pdfjs, stored] = await Promise.all([loadPdfjs(), history.bytes(target.id)]);
          if (cancelled) return;
          if (!stored) throw new Error(t('history.missing'));
          const data = new Uint8Array(stored.slice(0));
          task = pdfjs.getDocument({ data, isEvalSupported: false });
          loaded = await task.promise;
          if (cancelled) {
            loaded.destroy();
            return;
          }
          setLib(pdfjs);
          setDoc(loaded);
          setState({ phase: 'ready', message: '' });
          const measured = [];
          for (let number = 1; number <= loaded.numPages; number += 1) {
            const page = await loaded.getPage(number);
            if (cancelled) return;
            const viewport = page.getViewport({ scale: 1 });
            measured.push({ width: viewport.width, height: viewport.height });
            if (number === 1 || number % 25 === 0 || number === loaded.numPages) setSizes(measured.slice());
          }
        })().catch((error) => {
          if (cancelled) return;
          const password = error && error.name === 'PasswordException';
          setState({ phase: 'error', message: password ? t('viewer.password') : describe(error, t('viewer.failed')) });
        });
        return () => {
          cancelled = true;
          if (loaded) loaded.destroy();
          else if (task) task.destroy();
        };
      }, [target && target.id, reloadKey]);

      useEffect(() => {
        const node = scrollNode;
        if (!node) return undefined;
        const update = () => setAvailable(Math.max(0, node.clientWidth - PAGE_INSET * 2));
        update();
        const resize = new ResizeObserver(update);
        resize.observe(node);
        return () => resize.disconnect();
      }, [scrollNode]);

      const first = sizes[0];
      const clampZoom = (value) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, value));
      const scale = zoom === 'fit' ? (first && available > 0 ? clampZoom(available / first.width) : 1) : zoom;
      const step = (direction) => {
        const base = Math.round(scale * 100) / 100;
        setZoom(clampZoom(direction > 0 ? base * 1.25 : base / 1.25));
      };

      return h(ViewerFrame, {
        t, name: target ? target.name : '', state, ready: !!doc, loadingKey: 'viewer.loading',
        meta: doc ? t('viewer.pages', { count: doc.numPages }) : '',
        onReload: () => setReloadKey((n) => n + 1),
        scroll: { className: 'pdfr-scroll', ref: setScrollNode, 'data-pdfr-scroll': true },
        actions: [
          h(IconButton, { key: 'o', disabled: !doc, label: t('viewer.zoomOut'), onClick: () => step(-1) }, h(Icon, { name: 'minus' })),
          h('span', { key: 'z', className: 'pdfr-zoom' }, Math.round(scale * 100) + '%'),
          h(IconButton, { key: 'i', disabled: !doc, label: t('viewer.zoomIn'), onClick: () => step(1) }, h(Icon, { name: 'plus' })),
          h(IconButton, { key: 'f', disabled: !doc || zoom === 'fit', label: t('viewer.fit'), onClick: () => setZoom('fit') }, h(Icon, { name: 'fit' })),
        ],
      }, h('div', { className: 'pdfr-pages' }, sizes.length === 0 ? null : Array.from({ length: doc ? doc.numPages : 0 }, (_, index) => h(PdfPage, {
        key: index + 1, pdf: doc, pageNumber: index + 1, size: sizes[index] || first, scale, lib, observer,
      }))));
    }

    /** Rendered Markdown. The HTML comes from the sanitized output of the markdown chunk (marked + DOMPurify). */
    function MarkdownView(props) {
      const ref = useRef(null);
      // In-page links (footnotes, heading anchors) scroll inside the reader instead of changing the frame's URL.
      const onClick = (event) => {
        const link = event.target.closest && event.target.closest('a[href^="#"]');
        if (!link) return;
        event.preventDefault();
        const id = decodeURIComponent(link.getAttribute('href').slice(1));
        const target = ref.current && Array.from(ref.current.querySelectorAll('[id]')).find((node) => node.id === id);
        if (target) target.scrollIntoView({ block: 'center' });
      };
      return h('div', { ref, className: 'pdfr-md', onClick, dangerouslySetInnerHTML: { __html: props.html } });
    }

    /** Plain text, Markdown and CSV files; the text stays natively selectable. */
    function TextViewerTab(props) {
      const { kind } = props;
      const { t, target } = useViewerTarget(props);
      const [rendered, setRendered] = useState(true);
      const [reloadKey, setReloadKey] = useState(0);
      const isMarkdown = !!target && extensionOf(target.name) === 'md';
      const showRendered = isMarkdown && rendered;
      const [state, content] = useStoredFile(target, reloadKey, async (stored, file) => {
        const full = decodeText(stored).replace(/^\uFEFF/, '');
        if (kind === 'table') {
          return parseDelimited(full, TABLE_EXTENSIONS[extensionOf(file.name)] || ',', MAX_TABLE_ROWS);
        }
        const truncated = full.length > MAX_TEXT_CHARS;
        const text = truncated ? full.slice(0, MAX_TEXT_CHARS) : full;
        if (extensionOf(file.name) !== 'md') return { text, truncated };
        const { renderMarkdown } = await loadChunk('./client.markdown.js');
        return { text, truncated, html: renderMarkdown(text) };
      }, t);

      return h(ViewerFrame, {
        t, name: target ? target.name : '', state, ready: !!content,
        meta: content ? (kind === 'table' ? t('viewer.rows', { count: content.rows.length }) : t('viewer.chars', { count: content.text.length })) : '',
        onReload: () => setReloadKey((n) => n + 1),
        actions: isMarkdown && h(IconButton, {
          key: 'v', disabled: !content, label: t(rendered ? 'viewer.showSource' : 'viewer.showRendered'),
          'aria-pressed': rendered, onClick: () => setRendered((value) => !value),
        }, h(Icon, { name: rendered ? 'eye' : 'eyeOff' })),
      }, content && [
        kind === 'table'
          ? h(DataTable, { key: 'tbl', rows: content.rows })
          : showRendered
            ? h(MarkdownView, { key: 'md', html: content.html })
            : h('pre', { key: 'pre', className: 'pdfr-text', 'data-wrap': true }, content.text),
        content.truncated && h('div', { key: 'note', className: 'pdfr-note' }, t(kind === 'table' ? 'viewer.truncatedRows' : 'viewer.truncatedText')),
      ]);
    }

    /** Excel workbooks (xlsx, xls): one table per sheet, switched with tabs. */
    function SheetViewerTab(props) {
      const { t, target } = useViewerTarget(props);
      const [reloadKey, setReloadKey] = useState(0);
      const [active, setActive] = useState(0);
      const [state, workbook] = useStoredFile(target, reloadKey, async (stored) => {
        const XLSX = await loadChunk('./client.xlsx.js');
        const book = XLSX.read(new Uint8Array(stored), { type: 'array', sheetRows: MAX_TABLE_ROWS + 1 });
        return { XLSX, book };
      }, t);
      useEffect(() => setActive(0), [target && target.id]);

      const sheet = useMemo(() => {
        if (!workbook) return null;
        const { XLSX, book } = workbook;
        const name = book.SheetNames[active];
        const ws = name === undefined ? undefined : book.Sheets[name];
        if (!ws) return { rows: [], truncated: false };
        const all = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, defval: '', blankrows: true });
        const full = ws['!fullref'] ? XLSX.utils.decode_range(ws['!fullref']) : undefined;
        const rows = all.slice(0, MAX_TABLE_ROWS).map((row) => row.slice(0, MAX_TABLE_COLS));
        const wide = all.some((row) => row.length > MAX_TABLE_COLS);
        return { rows, truncated: all.length > MAX_TABLE_ROWS || (full ? full.e.r + 1 > MAX_TABLE_ROWS : false) || wide };
      }, [workbook, active]);

      const names = workbook ? workbook.book.SheetNames : [];
      const tabs = names.length > 1
        ? h('div', { key: 'tabs', className: 'pdfr-tabs', role: 'tablist' }, names.map((sheetName, index) => h('button', {
          key: index, type: 'button', role: 'tab', className: 'pdfr-tab', 'aria-selected': index === active, title: sheetName,
          onClick: () => setActive(index),
        }, sheetName)))
        : null;
      return h(ViewerFrame, {
        t, name: target ? target.name : '', state, ready: !!sheet, below: tabs,
        meta: sheet ? t('viewer.rows', { count: sheet.rows.length }) : '',
        onReload: () => setReloadKey((n) => n + 1),
      }, sheet && [
        sheet.rows.length === 0
          ? h('div', { key: 'empty', className: 'pdfr-state' }, t('viewer.emptySheet'))
          : h(DataTable, { key: 'tbl', rows: sheet.rows }),
        sheet.truncated && h('div', { key: 'note', className: 'pdfr-note' }, t('viewer.truncatedRows')),
      ]);
    }

    const EPUB_SKIP = new Set(['script', 'style', 'svg', 'img', 'image', 'audio', 'video', 'iframe', 'object', 'head', 'nav']);
    const EPUB_LEAF = new Set(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'pre', 'dt', 'dd', 'figcaption', 'td', 'th', 'caption']);
    /** Text of a node without the content of skipped elements (scripts, styles, images…). */
    function epubText(node) {
      if (node.nodeType === 3) return node.nodeValue;
      if (node.nodeType !== 1) return '';
      const tag = node.localName ? node.localName.toLowerCase() : '';
      if (EPUB_SKIP.has(tag)) return '';
      return Array.from(node.childNodes).map(epubText).join('');
    }
    /** Flatten one chapter document into text blocks; markup is never inserted into the page, only its text. */
    function epubBlocks(root, out) {
      for (const node of Array.from(root.childNodes)) {
        if (node.nodeType === 3) {
          const text = node.nodeValue.replace(/\s+/g, ' ').trim();
          if (text) out.push({ tag: 'p', text });
        } else if (node.nodeType === 1) {
          const tag = node.localName ? node.localName.toLowerCase() : '';
          if (EPUB_SKIP.has(tag)) continue;
          if (EPUB_LEAF.has(tag)) {
            const raw = epubText(node);
            const text = tag === 'pre' ? raw.replace(/\s+$/, '') : raw.replace(/\s+/g, ' ').trim();
            if (text.trim()) out.push({ tag, text });
          } else {
            epubBlocks(node, out);
          }
        }
      }
    }
    function parseMarkup(text, type) {
      const doc = new DOMParser().parseFromString(text, type);
      return doc.getElementsByTagName('parsererror').length > 0 ? undefined : doc;
    }
    function zipDir(path) {
      const index = path.lastIndexOf('/');
      return index < 0 ? '' : path.slice(0, index + 1);
    }
    /** Resolve a manifest href against the package file's folder inside the archive. */
    function zipResolve(base, href) {
      const parts = (base + decodeURIComponent(href.split('#')[0])).split('/');
      const stack = [];
      for (const part of parts) {
        if (part === '..') stack.pop();
        else if (part !== '.' && part !== '') stack.push(part);
      }
      return stack.join('/');
    }
    /** Read an EPUB archive into ordered chapters of text blocks (reading order from the package spine). */
    async function parseEpub(buffer) {
      const JSZip = await loadChunk('./client.jszip.js');
      const zip = await JSZip.loadAsync(buffer);
      const container = zip.file('META-INF/container.xml');
      if (!container) throw new Error('missing container.xml');
      const containerDoc = parseMarkup(await container.async('string'), 'application/xml');
      const rootfile = containerDoc && containerDoc.getElementsByTagName('rootfile')[0];
      const opfPath = rootfile && rootfile.getAttribute('full-path');
      const opfFile = opfPath && zip.file(opfPath);
      if (!opfFile) throw new Error('missing package document');
      const opf = parseMarkup(await opfFile.async('string'), 'application/xml');
      if (!opf) throw new Error('invalid package document');
      const base = zipDir(opfPath);
      const manifest = {};
      for (const item of Array.from(opf.getElementsByTagName('item'))) manifest[item.getAttribute('id')] = item.getAttribute('href');
      const titleNode = opf.getElementsByTagName('dc:title')[0];
      const chapters = [];
      let total = 0;
      let truncated = false;
      for (const ref of Array.from(opf.getElementsByTagName('itemref'))) {
        const href = manifest[ref.getAttribute('idref')];
        const file = href && zip.file(zipResolve(base, href));
        if (!file) continue;
        const raw = await file.async('string');
        const doc = parseMarkup(raw, 'application/xhtml+xml') || parseMarkup(raw, 'text/html');
        if (!doc) continue;
        const blocks = [];
        epubBlocks(doc.body || doc.documentElement, blocks);
        if (blocks.length === 0) continue;
        const kept = [];
        for (const block of blocks) {
          if (total + block.text.length > MAX_TEXT_CHARS) { truncated = true; break; }
          total += block.text.length;
          kept.push(block);
        }
        if (kept.length > 0) chapters.push(kept);
        if (truncated) break;
      }
      if (chapters.length === 0) throw new Error('no readable text (the book may be protected)');
      return { title: titleNode ? titleNode.textContent.trim() : '', chapters, truncated, chars: total };
    }

    /** Links inside a book page: the page is sandboxed and cannot open windows itself, so web links open from here. */
    function openBookLink(event) {
      const link = event.target && event.target.closest && event.target.closest('a[href]');
      const href = link && link.getAttribute('href');
      if (!href || !/^(https?:|mailto:)/i.test(href)) return;
      event.preventDefault();
      window.open(href, '_blank', 'noopener,noreferrer');
    }

    function TocList(props) {
      return props.items.map((item, index) => h(React.Fragment, { key: index }, [
        h('button', {
          key: 'b', type: 'button', className: 'pdfr-toc-item', title: item.label.trim(),
          style: { paddingLeft: 8 + props.depth * 14 }, onClick: () => props.onPick(item),
        }, item.label.trim()),
        item.subitems && item.subitems.length > 0 && h(TocList, { key: 's', items: item.subitems, depth: props.depth + 1, onPick: props.onPick }),
      ]));
    }

    /** The book itself: epub.ts lays the sections out as one scrolling column of sandboxed pages. */
    function EpubStage(props) {
      const { book, fontPct, toc, tocOpen, onCloseToc, onFail, t } = props;
      const hostRef = useRef(null);
      const renditionRef = useRef(null);
      const fontRef = useRef(fontPct);
      fontRef.current = fontPct;

      useEffect(() => {
        const host = hostRef.current;
        const size = () => ({ width: Math.max(1, host.clientWidth), height: Math.max(1, host.clientHeight) });
        const rendition = book.renderTo(host, { ...size(), flow: 'scrolled', manager: 'continuous', allowScriptedContent: false });
        renditionRef.current = rendition;
        const frames = [];
        const timer = setTimeout(onFail, 10000);
        rendition.on('rendered', () => clearTimeout(timer));
        rendition.themes.default({ img: { 'max-width': '100% !important', height: 'auto !important' }, body: { 'overflow-wrap': 'break-word' } });
        rendition.themes.fontSize(fontRef.current + '%');
        rendition.hooks.content.register((contents) => {
          const doc = contents.document;
          const frame = doc.defaultView && doc.defaultView.frameElement;
          if (frame) { readerFrames.add(frame); frames.push(frame); }
          doc.addEventListener('pointerdown', () => frameEvents.emit('down'));
          doc.addEventListener('pointerup', () => frameEvents.emit('up'));
          doc.addEventListener('selectionchange', () => frameEvents.emit('change'));
          doc.addEventListener('click', openBookLink);
        });
        Promise.resolve(rendition.display()).catch(() => { clearTimeout(timer); onFail(); });
        const observer = typeof ResizeObserver === 'function'
          ? new ResizeObserver(() => {
            // Until the first section is laid out the rendition has no manager to resize.
            if (!rendition.manager) return;
            const next = size();
            try { rendition.resize(next.width, next.height); } catch (error) { /* resized again on the next change */ }
          })
          : null;
        if (observer) observer.observe(host);
        return () => {
          clearTimeout(timer);
          if (observer) observer.disconnect();
          frames.forEach((frame) => readerFrames.delete(frame));
          renditionRef.current = null;
          try { rendition.destroy(); } catch (error) { /* already torn down */ }
        };
      }, [book]);

      useEffect(() => {
        if (renditionRef.current) renditionRef.current.themes.fontSize(fontPct + '%');
      }, [fontPct]);

      const pick = (item) => {
        onCloseToc();
        if (renditionRef.current) Promise.resolve(renditionRef.current.display(item.href)).catch(() => {});
      };
      return [
        h('div', { key: 'host', ref: hostRef, className: 'pdfr-epub-host' }),
        tocOpen && h('div', { key: 'toc', className: 'pdfr-toc', role: 'navigation', 'aria-label': t('viewer.toc') },
          h(TocList, { items: toc, depth: 0, onPick: pick })),
      ];
    }

    /** EPUB books: laid out by epub.ts with the book's own styles and images. A book the library cannot show falls back to plain text. */
    function EpubViewerTab(props) {
      const { t, target } = useViewerTarget(props);
      const [reloadKey, setReloadKey] = useState(0);
      const [fontPct, setFontPct] = useState(100);
      const [tocOpen, setTocOpen] = useState(false);
      const [fallback, setFallback] = useState(null);
      const [state, data] = useStoredFile(target, reloadKey, async (stored) => {
        try {
          const { ePub } = await loadChunk('./client.epub.js');
          const book = ePub(stored);
          // The library rejects several internal promises for a book it cannot open; the awaits below report that once.
          [book.opened, book.ready, ...Object.values(book.loaded || {})].forEach((promise) => {
            if (promise && typeof promise.catch === 'function') promise.catch(() => {});
          });
          await book.ready;
          const navigation = await book.loaded.navigation;
          const title = book.packaging && book.packaging.metadata && book.packaging.metadata.title;
          return { book, stored, toc: (navigation && navigation.toc) || [], title: title ? String(title).trim() : '' };
        } catch (error) {
          return { text: await parseEpub(stored) };
        }
      }, t);
      useEffect(() => () => {
        if (data && data.book) { try { data.book.destroy(); } catch (error) { /* already torn down */ } }
      }, [data]);

      const reading = !!(data && data.book) && !fallback;
      const text = fallback || (data && data.text);
      const onFail = () => {
        parseEpub(data.stored).then(setFallback, () => {});
      };
      const stepFont = (delta) => setFontPct((value) => Math.max(60, Math.min(220, value + delta)));
      return h(ViewerFrame, {
        t, name: target ? target.name : '', state, ready: !!data,
        meta: reading ? (data.title || '') : (text ? t('viewer.chars', { count: text.chars }) : ''),
        onReload: () => { setFallback(null); setTocOpen(false); setReloadKey((n) => n + 1); },
        scroll: reading ? { className: 'pdfr-epub-body' } : undefined,
        actions: reading && [
          h(IconButton, { key: 'c', disabled: data.toc.length === 0, label: t('viewer.toc'), 'aria-pressed': tocOpen, onClick: () => setTocOpen((value) => !value) }, h(Icon, { name: 'list' })),
          h(IconButton, { key: 'o', disabled: fontPct <= 60, label: t('viewer.zoomOut'), onClick: () => stepFont(-10) }, h(Icon, { name: 'minus' })),
          h('span', { key: 'z', className: 'pdfr-zoom' }, fontPct + '%'),
          h(IconButton, { key: 'i', disabled: fontPct >= 220, label: t('viewer.zoomIn'), onClick: () => stepFont(10) }, h(Icon, { name: 'plus' })),
        ],
      }, reading
        ? h(EpubStage, { book: data.book, fontPct, toc: data.toc, tocOpen, onCloseToc: () => setTocOpen(false), onFail, t })
        : text && h('div', { className: 'pdfr-epub' }, [
          text.chapters.map((blocks, index) => h('section', { key: index, className: 'pdfr-epub-chapter' },
            blocks.map((block, i) => (block.tag === 'pre'
              ? h('pre', { key: i, className: 'pdfr-text', 'data-wrap': true }, block.text)
              : h(/^h[1-6]$/.test(block.tag) ? block.tag : 'p', { key: i, className: block.tag === 'li' ? 'pdfr-epub-li' : undefined }, block.text))))),
          text.truncated && h('div', { key: 'note', className: 'pdfr-note' }, t('viewer.truncatedText')),
        ]));
    }

    /** Picks the viewer from the stored file's extension; an unknown extension can only be a PDF identified by MIME type. */
    function ViewerTab(props) {
      const { target } = useViewerTarget(props);
      const kind = (target && fileKind(target.name)) || 'pdf';
      if (kind === 'pdf') return h(PdfViewerTab, props);
      if (kind === 'sheet') return h(SheetViewerTab, props);
      if (kind === 'epub') return h(EpubViewerTab, props);
      return h(TextViewerTab, { ...props, kind });
    }

    /** Invisible component mounted in the composer scope: publishes the input actions of the current Session. */
    function ComposerBridge(props) {
      const { sessionId, inputActions } = props;
      useEffect(() => {
        bridge.sessionId = sessionId;
        bridge.actions = inputActions;
        return () => {
          if (bridge.actions === inputActions) {
            bridge.sessionId = undefined;
            bridge.actions = undefined;
          }
        };
      }, [sessionId, inputActions]);
      return null;
    }

    /** The current text selection when it lies entirely inside one of this plugin's readers in the right sidebar, on the page or in a book frame. */
    function readReaderSelection() {
      const own = window.getSelection();
      if (own && own.rangeCount > 0 && !own.isCollapsed) {
        const found = describeSelection(own, null);
        if (found) return found;
      }
      for (const frame of Array.from(readerFrames)) {
        if (!frame.isConnected) { readerFrames.delete(frame); continue; }
        let inner = null;
        try { inner = frame.contentDocument && frame.contentDocument.getSelection(); } catch (error) { inner = null; }
        if (inner && inner.rangeCount > 0 && !inner.isCollapsed) {
          const found = describeSelection(inner, frame);
          if (found) return found;
        }
      }
      return null;
    }

    /** Text and toolbar position of a selection; `frame` is the iframe that holds it, whose offset turns its rects into page coordinates. */
    function describeSelection(selection, frame) {
      const range = selection.getRangeAt(0);
      let element = frame;
      if (!frame) {
        const node = range.commonAncestorContainer;
        element = node.nodeType === 1 ? node : node.parentElement;
        if (!element || !element.closest) return null;
      }
      if (!element.closest('[data-sidebar-right-panel]') || !element.closest('[data-pdf-reader]')) return null;
      if (!frame) {
        for (const edge of [selection.anchorNode, selection.focusNode]) {
          const host = edge && (edge.nodeType === 1 ? edge : edge.parentElement);
          if (host && host.closest && host.closest('.pdfr-toolbar')) return null;
        }
      }
      let text = selection.toString().replace(/\r\n?/g, '\n').trim();
      if (!text) return null;
      if (text.length > MAX_SELECTION) text = text.slice(0, MAX_SELECTION);
      const owner = element.closest('[data-sidebar-right-session]');
      const rects = range.getClientRects();
      const rect = rects.length > 0 ? rects[rects.length - 1] : range.getBoundingClientRect();
      if (!rect || (rect.width === 0 && rect.height === 0)) return null;
      const offset = frame ? frame.getBoundingClientRect() : { left: 0, top: 0 };
      const last = { top: rect.top + offset.top, bottom: rect.bottom + offset.top, right: rect.right + offset.left };
      if (last.bottom < 0 || last.top > window.innerHeight) return null;
      if (frame) {
        const view = frame.closest('.pdfr-epub-body');
        const bounds = view && view.getBoundingClientRect();
        if (bounds && (last.bottom < bounds.top || last.top > bounds.bottom)) return null;
      }
      const named = buttons.get().filter((item) => item.name.trim() !== '');
      const inlineCount = named.filter((item) => !item.folded).length;
      const width = Math.min(window.innerWidth - 16, 24 + 108 * inlineCount + (named.length > inlineCount ? 48 : 0));
      const left = Math.max(8, Math.min(last.right - 24, window.innerWidth - width - 8));
      const below = last.bottom + 8;
      const top = below + TOOLBAR_HEIGHT > window.innerHeight ? Math.max(8, last.top - TOOLBAR_HEIGHT - 8) : below;
      return { text, left, top, sessionId: owner ? owner.dataset.sidebarRightSession : undefined };
    }

    function clearReaderSelections() {
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      readerFrames.forEach((frame) => {
        try {
          const inner = frame.contentDocument && frame.contentDocument.getSelection();
          if (inner) inner.removeAllRanges();
        } catch (error) { /* a frame that is gone has nothing to clear */ }
      });
    }

    /** Frame-wide layer: the floating "send to composer" button and its short confirmation. */
    function SelectionOverlay(props) {
      const t = props.t || tr;
      const [pending, setPending] = useState(null);
      const [toast, setToast] = useState(null);
      const dragging = useRef(false);
      const frame = useRef(0);
      const toastTimer = useRef(0);
      const [menuOpen, setMenuOpen] = useState(false);

      const refresh = useCallback(() => {
        cancelAnimationFrame(frame.current);
        frame.current = requestAnimationFrame(() => {
          setPending(dragging.current ? null : readReaderSelection());
        });
      }, []);

      useEffect(() => {
        const onDown = (event) => {
          const target = event.target;
          if (target && target.closest && target.closest('[data-pdfr-send]')) return;
          dragging.current = true;
          setPending(null);
        };
        const onUp = () => {
          dragging.current = false;
          setTimeout(refresh, 0);
        };
        const onChange = () => {
          if (!dragging.current) refresh();
        };
        const offFrames = frameEvents.subscribe((kind) => {
          if (kind === 'down') { dragging.current = true; setPending(null); }
          else if (kind === 'up') onUp();
          else onChange();
        });
        document.addEventListener('pointerdown', onDown, true);
        document.addEventListener('pointerup', onUp, true);
        document.addEventListener('selectionchange', onChange);
        document.addEventListener('scroll', refresh, true);
        window.addEventListener('resize', refresh);
        return () => {
          offFrames();
          document.removeEventListener('pointerdown', onDown, true);
          document.removeEventListener('pointerup', onUp, true);
          document.removeEventListener('selectionchange', onChange);
          document.removeEventListener('scroll', refresh, true);
          window.removeEventListener('resize', refresh);
          cancelAnimationFrame(frame.current);
          clearTimeout(toastTimer.current);
        };
      }, [refresh]);

      function showToast(next) {
        setToast(next);
        clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToast(null), 1800);
      }

      const configured = useButtons().filter((item) => item.name.trim() !== '');
      const inline = configured.filter((item) => !item.folded);
      const overflow = configured.filter((item) => item.folded);
      /** The arrow menu opens on whichever side has room for it; if neither does, the roomier side scrolls. */
      const menuPlacement = (() => {
        if (!pending) return { side: 'below', maxHeight: undefined };
        const need = overflow.length * 40 + 14;
        const roomBelow = window.innerHeight - (pending.top + TOOLBAR_HEIGHT + 6) - 8;
        const roomAbove = pending.top - 6 - 8;
        const side = roomBelow >= need || (roomAbove < need && roomBelow >= roomAbove) ? 'below' : 'above';
        const room = side === 'below' ? roomBelow : roomAbove;
        return { side, maxHeight: Math.max(60, Math.floor(room)) };
      })();
      useEffect(() => { setMenuOpen(false); }, [pending && pending.text, pending && pending.left, pending && pending.top]);

      function finish(at, ok, okText, failText) {
        setPending(null);
        if (ok) {
          clearReaderSelections();
          showToast({ ...at, tone: 'ok', text: t(okText) });
        } else {
          showToast({ ...at, tone: 'error', text: t(failText) });
        }
      }

      /** Run a button on the pending selection: copy it, or put it in the composer (and submit for 'send'). */
      async function run(button) {
        if (!pending) return;
        const at = { left: pending.left, top: pending.top };
        const message = composeMessage(button, pending.text);
        if (button.action === 'copy') {
          finish(at, await copyToClipboard(message), 'send.copied', 'send.copyFailed');
          return;
        }
        const immediately = button.action === 'send';
        const actions = bridge.actions;
        const sameSession = !pending.sessionId || pending.sessionId === bridge.sessionId;
        let ok = false;
        if (actions && sameSession) {
          try {
            ok = !!actions.insertText(message, actions.captureInsertion());
            if (ok && immediately) actions.submit();
          } catch (error) {
            console.error('deepread: insert failed', error);
          }
        }
        finish(at, ok, immediately ? 'send.sent' : 'send.done', 'send.failed');
      }

      function toolButton(button, role) {
        return h('button', {
          key: button.id, type: 'button', title: button.name, role, className: 'pdfr-send',
          onClick: () => run(button),
        }, [h(ButtonIcon, { key: 'g', icon: button.icon, size: 18 }), h('span', { key: 'l', className: 'pdfr-send-label' }, button.name)]);
      }

      return h(React.Fragment, null, [
        h('style', { key: 'css' }, CSS),
        pending && configured.length > 0 && h('div', {
          key: 'send', className: 'pdfr-actions', 'data-pdfr-send': true, role: 'toolbar',
          style: { left: pending.left, top: pending.top },
          onMouseDown: (event) => event.preventDefault(),
        }, [
          ...inline.map((button) => toolButton(button)),
          overflow.length > 0 && inline.length > 0 && h('span', { key: 'sep', className: 'pdfr-actions-sep', 'aria-hidden': true }),
          overflow.length > 0 && h('button', {
            key: 'more', type: 'button', className: 'pdfr-send pdfr-send-more', 'data-more': true,
            'aria-haspopup': 'menu', 'aria-expanded': menuOpen, title: t('send.more'), 'aria-label': t('send.more'),
            onClick: () => setMenuOpen((open) => !open),
          }, h(Icon, { name: 'chevronDown', size: 18 })),
          overflow.length > 0 && menuOpen && h('div', {
            key: 'menu', className: 'pdfr-actions-menu', role: 'menu',
            'data-side': menuPlacement.side, style: { maxHeight: menuPlacement.maxHeight },
          }, overflow.map((button) => toolButton(button, 'menuitem'))),
        ]),
        toast && h('div', {
          key: 'toast', className: 'pdfr-toast', role: 'status', 'data-tone': toast.tone,
          style: { left: toast.left, top: toast.top },
        }, [toast.tone === 'ok' ? h(Icon, { key: 'g', name: 'check' }) : null, toast.text]),
      ]);
    }

    return {
      inject: ['slots', 'locale', 'sidebarRightTabs', 'sidebarRight'],
      apply(ctx) {
        runtime.ctx = ctx;
        runtime.require = require;
        ctx.effect(() => {
          const disposeZh = ctx.locale.register(NS, 'zh', zh);
          const disposeEn = ctx.locale.register(NS, 'en', en);
          return () => {
            disposeZh();
            disposeEn();
          };
        }, 'deepread.locale');

        /* The picker page and its guide card: the right-sidebar entry. */
        ctx.effect(() => ctx.sidebarRightTabs.register({
          id: PICKER_ID,
          kind: PICKER_KIND,
          title: () => tr('tab.title'),
          guide: [{
            id: 'open',
            order: 40,
            title: () => tr('tab.title'),
            description: () => tr('guide.description'),
            icon: LogoGlyph,
          }],
        }), 'deepread.picker-type');

        /* The viewer declares no patterns: it opens only when the picker names its kind. */
        ctx.effect(() => ctx.sidebarRightTabs.register({
          id: VIEWER_ID,
          kind: VIEWER_KIND,
          canOpen: (address) => parseAddress(address) !== undefined,
          title: (address) => {
            const target = parseAddress(address);
            return target ? target.name : tr('tab.title');
          },
        }), 'deepread.viewer-type');

        ctx.slots.inject('sidebar.right.pane.tab', () => {
          const disposers = [
            ctx.slots.register({ name: 'sidebar.right.pane.tab', key: PICKER_ID, locale: NS }, guarded(PdfPickerTab)),
            ctx.slots.register({ name: 'sidebar.right.pane.tab', key: VIEWER_ID, locale: NS }, guarded(ViewerTab)),
          ];
          return () => disposers.forEach((dispose) => dispose());
        });
        ctx.effect(() => watchButtonStorage(), 'deepread.button-storage');
        ctx.slots.inject('conversation.composer.dock', () => ctx.slots.register({
          name: 'conversation.composer.dock', id: 'deepread-bridge', order: 1000,
        }, ComposerBridge));
        ctx.slots.inject('shell.overlay', () => ctx.slots.register({
          name: 'shell.overlay', id: 'deepread-selection', locale: NS,
        }, SelectionOverlay));
      },
    };
  },
});
