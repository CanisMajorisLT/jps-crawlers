import { expect } from 'chai'
import FlowControl from '../../src/crawlers/lib/api/flowControl'


describe.only('AdsCrawler', () =>{

    describe('flowControl', () =>{

        describe('push', () =>{

            it('should let push valid parts', () =>{
                const flowControl = new FlowControl({});
                const partOne = FlowControl.createPart(x=> x, 'one', 'two');
                const partTwo = FlowControl.createPart(x=> x, 'two');

                flowControl.push(partOne);
                flowControl.push(partTwo);
            });
        });

        it('should throw error when invalid part is being pushed', () =>{
            const flowControl = new FlowControl({});
            const partOne = FlowControl.createPart(x=> x, 'one', 'two');
            const partTwo = FlowControl.createPart(x=> x, 'three');

            flowControl.push(partOne);

            expect(() => {
                flowControl.push(partTwo);
            }).to.throw('Wrong sequence! Part three should be two')
        });

        describe('static __joinParts', () =>{
           it('should provide core to all given functions, compose them and call core.onFinish for last function', () =>{
               let hasLastMethodCalled = false;
               let trackingArray = [];

               function makeTestFunction(i) {
                   return FlowControl.createPart(core => next => data => {
                       data.push(i);
                       next(data)
                   });
               }

               const parts = [makeTestFunction(1), makeTestFunction(2), makeTestFunction(3)];
               const joinedParts = FlowControl.__joinParts(parts, {onFinish: () => hasLastMethodCalled = true});
               joinedParts(trackingArray);

               expect(hasLastMethodCalled).to.be.true;
               expect(trackingArray).to.deep.equal([1, 2, 3])

           });
        });
    })
});