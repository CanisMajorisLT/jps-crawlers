

class AdsCrawler {
    constructor(crawlerName, {flowControl}) {
        this.name = crawlerName;
        this.flowControl = flowControl;
    }


    start () {
        this.flowControl.start(null);
        // kad toliau judeti reik sulgavoti kaip suvaldyti visa sita flow
        // TODO next design and implement flow controll, [Generetor, Task Creator, Parser]() -> Done (result) -> [Generetor, task..](result) -> ... -> Agreggator -> ...
    }

}

export default AdsCrawler;