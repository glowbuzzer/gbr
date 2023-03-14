import { go_matrix, go_pose, LinkQuantities, LinkParamRepresentation, go_link } from "./Link"
import * as THREE from "three"

/* compute the forward jacobian function:
   the jacobian is a linear approximation of the kinematics function.
   It is calculated using derivation of the position transformation matrix,
   and usually used for feeding velocities through it.
   It is analytically possible to calculate the inverse of the jacobian
   (sometimes only the pseudoinverse) and to use that for the inverse kinematics.
*/
export function compute_jfwd(
    link_params: go_link[],
    link_number: number
): { Jfwd: go_matrix; T_L_0: go_pose } {
    const Jv = new go_matrix(3, link_number)
    const Jw = new go_matrix(3, link_number)
    // const R_i_ip1 = new go_matrix(3, 3)
    // const scratch = new go_matrix(3, link_number)
    // const R_inv = new go_matrix(3, 3)

    const pose: go_pose = new go_pose()
    const quat = new THREE.Quaternion()

    const P_ip1_i = new THREE.Vector3()

    Jv.el[0][0] = 0
    Jv.el[1][0] = 0
    Jv.el[2][0] = LinkQuantities.GO_QUANTITY_LENGTH == link_params[0].quantity ? 1 : 0
    Jw.el[0][0] = 0
    Jw.el[1][0] = 0
    Jw.el[2][0] = LinkQuantities.GO_QUANTITY_ANGLE == link_params[0].quantity ? 1 : 0

    //     /* initialize inverse rotational transform */
    if (LinkParamRepresentation.GO_LINK_DH == link_params[0].type) {
        link_params[0].dh.toPose(pose)

        // const { ret, pout: pose } = go_dh_pose_convert(link_params[0].dh)
    } else if (LinkParamRepresentation.GO_LINK_PP == link_params[0].type) {
        pose.copy(link_params[0].pp.pose)
        // const pose = link_params[0].pp.pose
    } else {
        console.log("Errror: unknown link type")
    }
    const T_L_0 = new go_pose().copy(pose)

    // *T_L_0 = pose;
    //     for (col = 1; col < link_number; col++) {
    //         /* T_ip1_i */
    //         if (GO_LINK_DH == link_params[col].type) {
    //             go_dh_pose_convert(&link_params[col].u.dh, &pose);
    //         } else if (GO_LINK_PP == link_params[col].type) {
    //             pose = link_params[col].u.pp.pose;
    //         } else
    //             return GO_RESULT_IMPL_ERROR;
    //         }

    for (let col = 1; col < link_number; col++) {
        /* T_ip1_i */
        if (LinkParamRepresentation.GO_LINK_DH == link_params[col].type) {
            link_params[col].dh.toPose(pose)

            // ;({ret: ret1, pout: pose} = go_dh_pose_convert(link_params[col].dh))
        } else if (LinkParamRepresentation.GO_LINK_PP == link_params[col].type) {
            pose.copy(link_params[col].pp.pose)
            // pose = link_params[col].pp.pose
        } else {
            console.log(Error("Errror: unknown link type"))

            const vec = new THREE.Vector3().copy(pose.tran)

            P_ip1_i.copy(vec)
            // P_ip1_i[0] = vec[0]
            // P_ip1_i[1] = vec[1]
            // P_ip1_i[2] = vec[2]

            quat.copy(pose.rot).invert()
            // (({qout: quat} = go_quat_inv(pose.rot)))

            // const {matrix: R_i_ip1} = go_quat_matrix_convert(quat)
            const R_i_ip1_m4 = new THREE.Matrix4().makeRotationFromQuaternion(quat)

            const R_i_ip1_m3 = new THREE.Matrix3().setFromMatrix4(R_i_ip1_m4)

            //         /* Jv */

            const R_i_ip1_gm = new go_matrix(3, 3).setFromMatrix3(R_i_ip1_m3)

            const scratch = Jw.crossVector(P_ip1_i)
            scratch.add(Jv)
            Jv.multiplyMatrices(R_i_ip1_gm, scratch)

            Jv.el[0][col] = 0
            Jv.el[1][col] = 0
            Jv.el[2][col] = LinkQuantities.GO_QUANTITY_LENGTH == link_params[col].quantity ? 1 : 0

            //         /* Jw */
            Jw.multiply(R_i_ip1_gm)

            Jw.el[0][col] = 0
            Jw.el[1][col] = 0
            Jw.el[2][col] = LinkQuantities.GO_QUANTITY_ANGLE == link_params[col].quantity ? 1 : 0

            if (LinkParamRepresentation.GO_LINK_DH == link_params[col].type) {
                link_params[col].dh.toPose(pose)

                // ;({ pout: pose } = go_dh_pose_convert(link_params[col].dh))
            } else if (LinkParamRepresentation.GO_LINK_PP == link_params[col].type) {
                pose.copy(link_params[col].pp.pose)

                // pose = link_params[col].pp.pose
            } else {
                console.log(Error("Errror: unknown link type"))
            }
        }
        T_L_0.multiply(pose)
    }

    /* rotate back into {0} frame */
    // const {matrix: R_inv} = go_quat_matrix_convert(T_L_0.rot)

    const R_inv = new go_matrix(3, 3).setFromQuaternion(T_L_0.rot)

    Jv.multiply(R_inv)
    Jw.multiply(R_inv)

    const Jfwd = new go_matrix(6, link_number)
    /* put Jv atop Jw in J */
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < link_number; col++) {
            if (row < 3) {
                Jfwd.el[row][col] = Jv.el[row][col]
            } else {
                Jfwd.el[row][col] = Jw.el[row - 3][col]
            }
        }
    }
    return { Jfwd: Jfwd, T_L_0: T_L_0 }
}
