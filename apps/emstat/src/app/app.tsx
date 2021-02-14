import React, { useEffect, useState, createRef } from "react"

import styled from "styled-components"
import { Row, Col, Divider , PageHeader, Card, Tree} from 'antd';
import  { TreeProps } from 'antd/lib/tree'
// import { isArray, isPlainObject, isFunction } from 'lodash'
// import { BitFieldDisplay } from "@glowbuzzer/controls"

import "antd/dist/antd.css"
import "./app.css"



// import lodash from 'lodash';

// const { isArray, isPlainObject, isFunction } = lodash;

// const TreeNode = Tree.TreeNode

// let id = 0

const TypeNode = styled.span`
  color: #bfbfbf;
`

const mydata = {
  myarray:[{array: [11111, 2, 3],
  boolean: true,
  color: '#82b92c',
  null: null,
  number: 123,
  object: {
    a: 'b',
    c: 'd',
    e: 'f'
  },
  string: 'Hello World'},{

    array: [11111, 2, 3],
    boolean: true,
    color: '#82b92c',
    null: null,
    number: 123,
    object: {
        a: 'b',
        c: 'd',
        e: 'f'
    },
    string: 'Hello World'}]

}



// function isPrimitive(value: any) {
//     return !isArray(value) && !isPlainObject(value) && !isFunction(value)
// }

// function getTreeNode(key: string, value: any) {
//     if (isPrimitive(value)) {
//         return <TreeNode key={String(id++)} title={`${key}: ${value}`} />
//     }
//     if (isArray(value)) {
//         const children = value.map((v, i) => getTreeNode(String(i), v))
//         const title = (
//             <span>
//         {key}
//                 <TypeNode> [{value.length}]</TypeNode>
//       </span>
//         )
//         return <TreeNode title={title}>{children}</TreeNode>
//     }
//     if (isPlainObject(value)) {
//         const keys = Object.keys(value)
//         const children = keys.map(key => getTreeNode(key, value[key]))
//         const title = (
//             <span>
//         {key}
//                 <TypeNode> {`{${keys.length}}`}</TypeNode>
//       </span>
//         )
//         return <TreeNode title={title}>{children}</TreeNode>
//     }
// }



// function getTreeNode(key: string, value: any) {
//     if (isPrimitive(value)) {
//         return <TreeNode key={String(id++)} title={`${key}: ${value}`} />
//     }
//     if (isArray(value)) {
//         const children = value.map((v, i) => getTreeNode(String(i), v))
//         const title = (
//             <span>
//         {key}
//                 <TypeNode> [{value.length}]</TypeNode>
//       </span>
//         )
//         return <TreeNode title={title}>{children}</TreeNode>
//     }
//     if (isPlainObject(value)) {
//         const keys = Object.keys(value)
//         const children = keys.map(key => getTreeNode(key, value[key]))
//         const title = (
//             <span>
//         {key}
//                 <TypeNode> {`{${keys.length}}`}</TypeNode>
//       </span>
//         )
//         return <TreeNode title={title}>{children}</TreeNode>
//     }
// }

// function getTreeNodes(data: any) {
//     if (isArray(data)) {
//         return getTreeNode('array', data)
//     }
//     if (isPlainObject(data)) {
//         return getTreeNode('object', data)
//     }
// }

// export interface JSONTreeProps extends TreeProps {
//     // data: Record<string, unknown>
//     data: object
// }

// export class JSONTree extends React.Component<JSONTreeProps> {
//     render() {
//         const { data, ...restProps } = this.props
//
//         const treeNodes = getTreeNodes(data)
//
//         // console.log(treeNodes);
//
//         const onSelect = (selectedKeys, info) => {
//             console.log('selected', selectedKeys, info);
//         };
//
//         return (
//             <Tree showLine defaultExpandAll={true} onSelect={onSelect} {...restProps}>
//                 {treeNodes}
//             </Tree>
//         )
//     }
// }

const style = { background: '#ffffff', padding: '8px 8px' };


const StyledApp = styled.div`
    header {
        font-size: 2em;
    }

    .name {
        font-size: 1.5em;
    }

    .url {
    }
`

setTimeout(() => {
    console.log('Hello, World!')
}, 3000);

// interface gb_node {
//     title?:string,
//     key?: string,
//     disabled?: boolean,
//     disableCheckbox?: boolean,
//     children?:  Array<gb_node>
// }

// interface gb_tree extends Array<gb_node> { }
//
//
//
// let treeData =[
//     {
//         title: 'parent 9',
//         key: '0-0',
//         children: [
//             {
//                 title: 'parent 1-0',
//                 key: '0-0-0',
//                 disabled: true,
//                 children: [
//                     {
//                         title: 'leaf',
//                         key: '0-0-0-0',
//                         disableCheckbox: true,
//                     },
//                     {
//                         title: 'leaf',
//                         key: '0-0-0-1',
//                     },
//                 ],
//             },
//             {
//                 title: 'parent 1-1',
//                 key: '0-0-1',
//
//             },
//         ],
//     },
// ];

// const Demo2 = ({ dataObject }: { dataObject: any }) => {
//
//     return (<JSONTree data={dataObject} />);
//
// }
// const Demo = ({ dataObject }: { dataObject: any }) => {
//
//
//     const onSelect = (selectedKeys: React.Key[], info: any) => {
//         console.log('selected', selectedKeys, info);
//     };
//
//     const onCheck = (checkedKeys: React.Key[], info: any) => {
//         console.log('onCheck', checkedKeys, info);
//     };
//
//     return (
//         <Tree
//             checkable
//             // defaultExpandedKeys={['0-0-0', '0-0-1']}
//             // defaultSelectedKeys={['0-0-0', '0-0-1']}
//             // defaultCheckedKeys={['0-0-0', '0-0-1']}
//             // onSelect={onSelect}
//             onCheck={onCheck}
//             treeData={dataObject}
//
//         />
//     );
// };

interface DataNode {
    title: string;
    key: string;
    isLeaf?: boolean;
    children?: DataNode[];
}


// const initTreeDate: DataNode[] = [
//     { title: 'Expand to load', key: '0' },
//     { title: 'Expand to load', key: '1' },
//     { title: 'Tree Node', key: '2', isLeaf: true },
// ];


// function updateTreeData(list: DataNode[], key: React.Key, children: DataNode[]): DataNode[] {
//     return list.map(node => {
//         if (node.key === key) {
//             return {
//                 ...node,
//                 children,
//             };
//         } else if (node.children) {
//             return {
//                 ...node,
//                 children: updateTreeData(node.children, key, children),
//             };
//         }
//         return node;
//     });
// }

const ShowTree = ({ dataObject }: { dataObject: any }) => {
    return <Tree showLine treeData={dataObject} />;
};


// export function dg(){
//     var obj: gb_tree_i ={};
//     obj.children =[];
//
//     obj.title = "title1";
//
//     for(var i =0; i < 1; i++) {
//
//         let mynode: gb_tree_i = {title: "title2", key: "key2"};
//
//
//         obj.children.push(mynode);
//
//     }

    //
    // console.log(obj);
    //
// }


// }




export const App = () => {

    const [emstat_const_result, emstat_const_setResult] = useState(null)
    const [emstat_status_result, emstat_status_setResult] = useState(null)
    const [zen, setZen] = useState("")



    console.log("hello dg");
    // dg();

    // let obj: gb_tree  = [
    //
    // ];

    // let obj = {} as gb_tree;

    // const obj: gb_tree  = [
    //     {children: []},
    // ];

    // const obj: gb_tree  = [
    //     {children: []},
    // ];

    // const obj: gb_tree  = [
    //     {title: "title1", key: "key1", children: [{title: "title2", key: "key2"}, {title: "title3", key: "key3"}]},
    // ];
//
//
//     obj[0].children[0].title = "title22";
// obj[0].title = "title7";
//
//
// const obj2: gb_node = {title: emstat_status_result?.slaves[0].name, key: "key88"};
//
//     obj[0].children.push(obj2);

    // obj.pop();
    //
    // for(var i =0; i < 2; i++) {
    //
    //     obj.push({title:emstat_status_result?.slaves[i].name, key:"7"+i, children:[{title: "Error:"+123, key: ""+i}]});
    //
    // }

// const obj2: gb_node = {title: "EK1100", key: "key88"};
//     obj[0].children.push(obj2);
//     obj[0].children.push({title: "Error", key: "key88"} );
//     obj[0].children.push({title: "Has DC", key: "key00"} );
    // obj[0].children[0].title = "EK1100";





    // const obj: gb_tree = emstat_status_result as gb_tree;


    // console.log(treeData);
    // console.log(obj);
    // treeData[0].title = "Slaves";
    // treeData[0].children[0].title = emstat_status_result?.slaves[0].name;
    // treeData[0].children[1].title = emstat_status_result?.slaves[1].name;


    // { title: emstat_status_result?.slaves[0].name, key: '0', children:[{title:"mytotle", key:"3"}] },
    // { title: emstat_status_result?.slaves[1].name, key: '1' },


    const alTable = {
        0 : "No error",
        1 : "Unspecified error",
        2 :"No memory",
        17: "Invalid requested state change",
        18: "Unknown requested state",
        19: "Bootstrap not supported",
        20: "No valid firmware",
        21: "Invalid mailbox configuration",
        22: "Invalid mailbox configuration",
        23: "Invalid sync manager configuration",
        24: "No valid inputs available",
        25: "No valid outputs",
        26: "Synchronization error",
        27: "Sync manager watchdog",
        28: "Invalid sync Manager types",
        29: "Invalid output configuration",
        30: "Invalid input configuration",
        31: "Invalid watchdog configuration",
        32: "Slave needs cold start",
        33: "Slave needs INIT",
        34: "Slave needs PREOP",
        35: "Slave needs SAFEOP",
        36: "Invalid input mapping",
        37: "Invalid output mapping",
        38: "Inconsistent settings",
        39: "Freerun not supported",
        40: "Synchronisation not supported",
        41: "Freerun needs 3buffer mode",
        42: "Background watchdog",
        43: "No valid Inputs and Outputs",
        44: "Fatal sync error",
        45: "No sync error",
        46: "Invalid input FMMU configuration",
        48: "Invalid DC SYNC configuration",
        49: "Invalid DC latch configuration",
        50: "PLL error",
        51: "DC sync IO error",
        52: "DC sync timeout error",
        53: "DC invalid sync cycle time",
        54: "DC invalid sync0 cycle time",
        55: "DC invalid sync1 cycle time",
        65: "MBX_AOE",
        66: "MBX_EOE",
        67: "MBX_COE",
        68: "MBX_FOE",
        69: "MBX_SOE",
        79: "MBX_VOE",
        80: "EEPROM no access",
        81: "EEPROM error",
        96: "Slave restarted locally",
        97: "Device identification value updated",
        240: "Application controller available",
        65535: "Unknown"
    }
    const alMapper = (al) => alTable[al] || "No alarm";



    const slaveStateTable = {
        0 : "EC State: None",
        1 : "EC State: Init",
        2 : "EC State: Pre-op",
        3 : "EC State: Boot",
        4 : "EC State: Safe-op",
        8 : "EC State: Operational",
        16 : "EC State: Error Ack",
        17 : "EC State: Init error active",
        18 : "EC State: Pre-op error active",
        24 : "EC State: Safe-op error active",
        32 : "EC State: ?"
    }

    const slaveStateMapper = (slaveState) => slaveStateTable[slaveState] || "No state";

    const slaveTreeData: DataNode[] = [

    ];

    let keyCount:number = 0;




    for(var i =0; i < 2; i++) {
        // for(var i =0; i < emstat_const_result.number_of_slaves; i++) {

        slaveTreeData.push({ title: emstat_status_result?.slaves[i].name, key: ''+ keyCount++});

        slaveTreeData[i].children = new Array();
        slaveTreeData[i].children.push({ title: "address: 0x"+emstat_status_result?.slaves[i].address.toString(16), key: ''+ keyCount++});
        slaveTreeData[i].children.push({ title: "state: "+ slaveStateMapper(emstat_status_result?.slaves[i].state), key: ''+ keyCount++});
        slaveTreeData[i].children.push({ title: "has DC?: " +(emstat_status_result?.slaves[i].hasdc? "true":"false"), key: ''+ keyCount++});
    }

    const driveTreeData: DataNode[] = [

    ];
    //todo work out how to hanlde the undefined? at at st
    for(var i =0; i < 2; i++) {
    // for(var i =0; i < emstat_const_result.number_of_drives; i++) {

        driveTreeData.push({ title: emstat_status_result?.drives[i].name, key: ''+ keyCount++});

        driveTreeData[i].children = new Array();
        driveTreeData[i].children.push({ title: "name: "+emstat_status_result?.drives[i].name, key: ''+ keyCount++});
        driveTreeData[i].children.push({ title: "alarm: "+ emstat_status_result?.drives[i].alarm, key: ''+ keyCount++});
        driveTreeData[i].children.push({ title: "actpos: " + emstat_status_result?.drives[i].actpos.toLocaleString(), key: ''+ keyCount++});
    }



    useEffect(
        () => {
            const interval = setInterval(() => {
                 fetch("http://localhost:9001/gb-em_const.json")
                .then(emstat_const_result => emstat_const_result.json())
                .then(json => emstat_const_setResult(json))},10000);

            return () => clearInterval(interval);

        },
        [
            /**
             * When this dependency list is empty, effect is run once on page load
             **/
        ]
    )

    useEffect(
        () => {
            const interval = setInterval(() => {
            fetch("http://localhost:9001/gb-em_status.json")
                .then(emstat_status_result => emstat_status_result.json())
                .then(json => emstat_status_setResult(json))},10000);
            return () => clearInterval(interval);


        },
        [
            /**
             * When this dependency list is empty, effect is run once on page load
             **/
        ]

    )

    useEffect(() => {
        fetch("https://api.github.com/zen")
            .then(result => result.text())
            .then(txt => setZen(txt))
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            console.log('This will run after 5 second!')
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <StyledApp>
            <main>
                <PageHeader
                    className="site-page-header"
                    title="emstat"
                    subTitle="EtherCAT master status view"
                />,
                <Card title="Machine status">
                    <p>Machine status: Fault reactio active </p>
                    <p>Machine command: Disable voltage</p>
                    <p>Shared memory connection established: true </p>
                    <p>Heartbeat IN: 1093 </p>
                    <p>Heartbeat OUT: 1094</p>
                    <p>EtherCAT error: None</p>
                    <p>Machine active faults: None</p>
                    <p>Machine fault history: None</p>
                </Card>

                {/*<Divider orientation="left">Slave & Drive status</Divider>*/}
                <Card title="Slave & Drive status">
                <Row gutter={16}>
                    <Col className="gutter-row" span={11}>
                        <div style={style}><b>EtherCAT slave status</b></div>
                        <div style={style}>Number of slaves found on EtherCAT network: {emstat_const_result?.number_of_slaves}</div>
                    </Col>
                    <Col className="gutter-row" span={11}>
                        <div style={style}><b>Drive status</b></div>
                        <div style={style}>Number of drives found on EtherCAT network: {emstat_const_result?.number_of_drives}</div>
                    </Col>

                </Row>
                <Row gutter={16}>
                    <Col className="gutter-row" span={11}>
                        <div style={style}><ShowTree dataObject={slaveTreeData}/></div>
                    </Col>
                    <Col className="gutter-row" span={11}>
                        <div style={style}><ShowTree dataObject={driveTreeData}/></div>
                    </Col>

                </Row>
                </Card>
                <Card title="Digital Analogue Integer in/out status">
                    {/*<BitFieldDisplay bitCount={8} value={7}  />*/}
                </Card>



            </main>
        </StyledApp>
    )
}

export default App
