import React from 'react'
import {Provider} from 'react-redux'
import {renderToString} from 'react-dom/server'
const { renderStaticOptimized } = require(`glamor/server`)

import createStore from './src/state/createStore'

exports.replaceRenderer = ({bodyComponent, replaceBodyHTMLString, setHeadComponents}) => {
    const store = createStore();

    const ConnectedBody = () => (
        <Provider store={store}>
            {bodyComponent}
        </Provider>
    );
    let { html, css, ids } = renderStaticOptimized(() =>
        renderToString(<ConnectedBody/>)
    );

    replaceBodyHTMLString(html)

    setHeadComponents([
        <style
            id="glamor-styles"
            key="glamor-styles"
            dangerouslySetInnerHTML={{ __html: css }}
        />,
        <script
            id="glamor-ids"
            key="glamor-ids"
            dangerouslySetInnerHTML={{
                __html: `
        // <![CDATA[
        window._glamor = ${JSON.stringify(ids)}
        // ]]>
        `,
            }}
        />,
    ])
}
