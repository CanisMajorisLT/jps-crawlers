import CVB from './cvb/main'
import CVO from './cvo/main'

function onDoneWrapper() {
    let res;
    const prom = new Promise((resolve, reject)=>{
        res = resolve
    });

    return [prom, res]
}

export async function crawl({
    taskSuccessHandler: taskSuccessHandler,
    onDone: onDone,
    taskConfig: taskConfig
    }) {

    const [onDoneWrapCVB, resolveOnDoneCVB] = onDoneWrapper();
    const [onDoneWrapCVO, resolveOnDoneCVO] = onDoneWrapper();

    CVB(taskSuccessHandler, taskConfig, resolveOnDoneCVB);
    CVO(taskSuccessHandler, taskConfig, resolveOnDoneCVO);

    await Promise.all([onDoneWrapCVB, onDoneWrapCVO]);
    onDone()
}