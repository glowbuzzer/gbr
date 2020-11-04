import * as React from "react";
import {Provider as ConfigProvider} from "./providerForConfig";
import {Provider as KinematicsProvider} from "./providerForKinematics";
import {Provider as TasksProvider} from "./providerForTasks";
import {Provider as ToolPathProvider} from "./providerForToolPath";
import {Provider as PrefsProvider} from "@glowbuzzer/hooks";
import {UnitSelector} from "@glowbuzzer/controls";
import styles from "./theme/CodeBlock/styles.module.css";
import classnames from "classnames";
import Clipboard from 'clipboard';
import Highlight, {defaultProps} from 'prism-react-renderer';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

console.log("PROVIDER", ConfigProvider);
console.log("PROVIDER", KinematicsProvider);
console.log("PROVIDER", PrefsProvider);
console.log("PROVIDER", TasksProvider);
console.log("PROVIDER", ToolPathProvider);

export const GlowbuzzerPreview = ({code, children, theme, showUnits}) => {
    const [showCode, setShowCode] = React.useState(false);
    const [showCopied, setShowCopied] = React.useState(false);

    const button = React.useRef(null);
    const target = React.useRef(null);

    React.useEffect(() => {
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

    const handleCopyCode = () => {
        window.getSelection().empty();
        setShowCopied(true);

        setTimeout(() => setShowCopied(false), 2000);
    };

    const toggleCode = () => {
        setShowCode(!showCode);
    };

    if (!ExecutionEnvironment.canUseDOM) {
        return <div>Server side rendering not supported!</div>
    }

    return <ToolPathProvider><PrefsProvider><ConfigProvider><TasksProvider>
        <KinematicsProvider>
            {showUnits && <div className="glowbuzzer-unit-selector">
                <UnitSelector type="scalar"/>
                <UnitSelector type="angular"/>
            </div>}
            <div className="glowbuzzer-preview">
                <div onClick={toggleCode} className={"code-expand" + (showCode ? " code-expand-show" : "")}>
                    <HtmlCoding/>
                </div>

                {children}

                {showCode && <Highlight
                    {...defaultProps}
                    theme={theme}
                    code={code.trim()}
                    language={"jsx"}>
                    {({className, style, tokens, getLineProps, getTokenProps}) => (
                        <div className={styles.codeBlockWrapper}>
                            <pre ref={target} className={classnames(className, styles.codeBlock)} style={style}>
                            {tokens.map((line, i) => {
                                const lineProps = getLineProps({line, key: i});

                                // if (highlightLines.includes(i + 1)) {
                                //     lineProps.className = `${lineProps.className} docusaurus-highlight-code-line`;
                                // }

                                return (<div key={i} {...lineProps}>
                                    {line.map((token, key) => (
                                        <span key={key} {...getTokenProps({token, key})} />
                                    ))}
                                </div>);
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
                </Highlight>}
            </div>
        </KinematicsProvider></TasksProvider></ConfigProvider>
    </PrefsProvider></ToolPathProvider>
};

const HtmlCoding = () => <svg version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 502.664 502.664">
    <g>
        <g>
            <path d="M153.821,358.226L0,274.337v-46.463l153.821-83.414v54.574L46.636,250.523l107.185,53.431
			C153.821,303.954,153.821,358.226,153.821,358.226z"/>
            <path d="M180.094,387.584L282.103,115.08h32.227L212.084,387.584H180.094z"/>
            <path d="M348.843,358.226v-54.272l107.164-52.999l-107.164-52.59v-53.927l153.821,83.522v46.183
			L348.843,358.226z"/>
        </g>
    </g>
</svg>;
