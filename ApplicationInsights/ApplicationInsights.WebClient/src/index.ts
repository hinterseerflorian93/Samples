import './index.css';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';

const host = 'https://localhost:7082';
//const host = 'https://basta-2022-bff.azurewebsites.net';

const appInsights = new ApplicationInsights({
    config: {
        connectionString:
            'InstrumentationKey=636be64b-2d01-493e-ac61-d58cc21a743b;IngestionEndpoint=https://westeurope-5.in.applicationinsights.azure.com/',

        // Enable correlation to get end-to-end transaction view. Read more at
        // https://docs.microsoft.com/en-us/azure/azure-monitor/app/javascript#enable-correlation
        disableFetchTracking: false,
        enableCorsCorrelation: true,
        enableRequestHeaderTracking: true,
        enableResponseHeaderTracking: true,

        // Other Configuration Options. Read more at
        // https://docs.microsoft.com/en-us/azure/azure-monitor/app/javascript#configuration
    },
});
appInsights.loadAppInsights();

// Manually call trackPageView to establish the current user/session/pageview
appInsights.trackPageView();

const fetchDataBtn = document.getElementById('fetch-data') as HTMLButtonElement;
const dataResult = document.getElementById('data-result') as HTMLDivElement;
fetchDataBtn.onclick = async () => {
    const response = await fetch(`${host}/ping`);
    const data = await response.json();
    dataResult.innerText = data;
};

const fetchSecretDataBtn = document.getElementById('fetch-secret-data') as HTMLButtonElement;
const secretDataResult = document.getElementById('secret-data-result') as HTMLDivElement;
const pwdInput = document.getElementById('pwd-input') as HTMLInputElement;
fetchSecretDataBtn.onclick = async () => {
    try {
        const auth = `rainer:${pwdInput.value}`;
        const response = await fetch(`${host}/secret-ping`, {
            method: 'GET',
            headers: {
                Authorization: `Basic ${window.btoa(auth)}`,
            },
        });
        const data = await response.json();
        secretDataResult.innerText = data;
    } catch (ex) {
        secretDataResult.innerText = `ERROR: ${(<any>ex).message}`;
    }
};

const divBtn = document.getElementById('div') as HTMLButtonElement;
const divResult = document.getElementById('div-result') as HTMLDivElement;
const xInput = document.getElementById('x-input') as HTMLInputElement;
const yInput = document.getElementById('y-input') as HTMLInputElement;
const inBackendCheckbox = document.getElementById('in-backend') as HTMLInputElement;
divBtn.onclick = async () => {
    const response = await fetch(`${host}/div${inBackendCheckbox.checked ? '-backend' : ''}?x=${xInput.value}&y=${yInput.value}`);
    const data = await response.json();
    if (response.ok) {
        divResult.innerText = `The result is ${data}`;
    } else {
        divResult.innerText = `ERROR: ${data.detail} (${data.RequestId})`;
    }
};