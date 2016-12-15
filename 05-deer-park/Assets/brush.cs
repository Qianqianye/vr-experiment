using UnityEngine;
using System.Collections;
using UnityEngine.SceneManagement;

public class brush : MonoBehaviour {
	public float timeBetweenInk;
	public  float inkLifeSpan;
	public GameObject inkPrefab;
	public bool enableDestroy;
	public bool enableBrush;

	private SteamVR_Controller.Device device;
	private SteamVR_TrackedObject trackedObject;


	private void DropInk () {
		GameObject instance = (GameObject)Instantiate (inkPrefab, this.gameObject.transform.position, Quaternion.identity);
		if (enableDestroy) {
			Destroy (instance, inkLifeSpan);
		}
	}

	private void Awake (){
		//InvokeRepeating("DropInk", 0f, timeBetweenInk);

		trackedObject = GetComponent<SteamVR_TrackedObject>();

	}

	private void ToggleBrush(){
		enableBrush = !enableBrush;
		if (enableBrush) {
			InvokeRepeating("DropInk", 0f, timeBetweenInk);
		} else {
			CancelInvoke ();
		}
	}

	private void ToggleDestroy(){
		enableDestroy = !enableDestroy;
	}

	void Update(){
		device = SteamVR_Controller.Input((int)trackedObject.index);
		if(device.GetPressDown(SteamVR_Controller.ButtonMask.Trigger)){
			ToggleBrush ();
			Debug.Log("Trigger Pressed");
		}
//		if(device.GetPressDown(SteamVR_Controller.ButtonMask.Touchpad)){
//			ResetScene ();
//			Debug.Log("Touchpad Pressed");
//		}
	}

	//private void ResetScene(){
	//	SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex);
	//}


}