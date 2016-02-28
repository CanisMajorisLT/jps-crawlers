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
    config: config
    }) {

    const [onDoneWrapCVB, resolveOnDoneCVB] = onDoneWrapper();
    const [onDoneWrapCVO, resolveOnDoneCVO] = onDoneWrapper();

    CVB(taskSuccessHandler, config, resolveOnDoneCVB);
    CVO(taskSuccessHandler, config, resolveOnDoneCVO);

    await Promise.all([onDoneWrapCVB, onDoneWrapCVO]);
    onDone()
}