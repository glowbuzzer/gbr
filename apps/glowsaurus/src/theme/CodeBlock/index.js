/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useEffect, useState, useRef} from 'react';
import classnames from 'classnames';
import Highlight, {defaultProps} from 'prism-react-renderer';
import defaultTheme from 'prism-react-renderer/themes/palenight';
import Clipboard from 'clipboard';
import rangeParser from 'parse-numeric-range';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Playground from '@theme/Playground';
import styles from './styles.module.css';
import {GlowbuzzerPreview} from "../../GlowbuzzerPreview";

const highlightLinesRangeRegex = /{([\d,-]+)}/;

export default ({
  children,
  className: languageClassName,
  live,
  gb,
  showUnits,
  metastring,
  ...props
}) => {
  const {
    siteConfig: {
      themeConfig: {prism = {}},
    },
  } = useDocusaurusContext();
  const [showCopied, setShowCopied] = useState(false);
  const target = useRef(null);
  const button = useRef(null);
  let highlightLines = [];

  if (metastring && highlightLinesRangeRegex.test(metastring)) {
    const highlightLinesRange = metastring.match(highlightLinesRangeRegex)[1];
    highlightLines = rangeParser.parse(highlightLinesRange).filter(n => n > 0);
  }

  useEffect(() => {
    let clipboard;

    if (button.current) {
      clipboard = new Clipboard(button.current, {
        target: () => target.current,
      });
    }

    return () => {
      if (clipboard) {
        clipboard.destroy();
      }
    };
  }, [button.current, target.current]);

  if (gb) {
      const node=require("../../../docs/"+gb).default;
      const raw_file=require("!!raw-loader!../../../docs/"+gb).default;
      return <GlowbuzzerPreview code={raw_file} theme={prism.theme || defaultTheme} showUnits={showUnits}>
          {React.createElement(node)}
      </GlowbuzzerPreview>;
  }
  if (live) {
    return (
      <Playground
        scope={{...React}}
        code={children.trim()}
        theme={prism.theme || defaultTheme}
        {...props}
      />
    );
  } else {
    // console.log("IT'S NOT LIVE!");
  }

  let language =
    languageClassName && languageClassName.replace(/language-/, '');

  if (!language && prism.defaultLanguage) {
    language = prism.defaultLanguage;
  }

  const handleCopyCode = () => {
    window.getSelection().empty();
    setShowCopied(true);

    setTimeout(() => setShowCopied(false), 2000);
  };

  return (
    <Highlight
      {...defaultProps}
      theme={prism.theme || defaultTheme}
      code={children.trim()}
      language={language}>
      {({className, style, tokens, getLineProps, getTokenProps}) => (
        <div className={styles.codeBlockWrapper}>
          <pre
            ref={target}
            className={classnames(className, styles.codeBlock)}
            style={style}>
            {tokens.map((line, i) => {
              const lineProps = getLineProps({line, key: i});

              if (highlightLines.includes(i + 1)) {
                lineProps.className = `${lineProps.className} docusaurus-highlight-code-line`;
              }

              return (
                <div key={i} {...lineProps}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({token, key})} />
                  ))}
                </div>
              );
            })}
          </pre>
          <button
            ref={button}
            type="button"
            aria-label="Copy code to clipboard"
            className={styles.copyButton}
            onClick={handleCopyCode}>
            {showCopied ? 'Copied' : 'Copy'}
          </button>
        </div>
      )}
    </Highlight>
  );
};
