import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes } from '~/routes/index.js';
import { DefaultLayout } from '~/components/Layout';
import { Fragment } from 'react';
import '~/style/DarkMode.scss';
import { useContext } from 'react';
import { DarkModeContext } from '~/context/darkModeContext';
import 'antd/dist/antd.css';

function App() {
    const { darkMode } = useContext(DarkModeContext);
    return ( <
        div className = { darkMode ? 'app dark' : 'app' } >
        <
        Router >
        <
        div className = "App" >
        <
        Routes > {
            publicRoutes.map((route, index) => {
                const Page = route.component;
                let Layout = DefaultLayout;
                if (route.layout) {
                    Layout = route.layout;
                } else if (route.layout === null) {
                    Layout = Fragment;
                }
                return ( <
                    Route key = { index }
                    path = { route.path }
                    element = { <
                        Layout >
                        <
                        Page / >
                        <
                        /Layout>
                    }
                    />
                );
            })
        } <
        /Routes> <
        /div> <
        /Router> <
        /div>
    );
}

export default App;