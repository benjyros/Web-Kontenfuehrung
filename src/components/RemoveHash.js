import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

function RemoveHash({ children }) {
    const history = useHistory();

    useEffect(() => {
        if (history.location.hash === '#/') {
            history.replace('/');
        }
    }, [history]);

    return children;
}

export default RemoveHash;
