import * as React from 'react';
import styles from './FileUpload.module.scss';
import { IFileUploadProps } from './IFileUploadProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { sp } from "@pnp/sp";
import * as pnp from 'sp-pnp-js';
interface IFileUploadState {
}

export default class FileUpload extends React.Component<IFileUploadProps, IFileUploadState> {
  private _input: React.RefObject<HTMLInputElement>;
  constructor(props: IFileUploadProps) {
    super(props);
    sp.setup({
      spfxContext: this.props.context,
    })
    this._input = React.createRef();
  }
  private uploadFileFromControl = (event: React.ChangeEvent<HTMLInputElement>) => {
    //Get the file from File DOM
    var files = event.target.files;
    var file = files[0];
    //Upload a file to the SharePoint Library
    console.log("propsss", this.props);
    console.log("file", file);
    const replacement = '';
    const illegalRe = /[\/\?<>\\:\*\|"]/g;
    const controlRe = /[\x00-\x1f\x80-\x9f]/g;
    const reservedRe = /^\.+$/;
    const windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
    const windowsTrailingRe = /[\. ]+$/;

    let furl = URL.createObjectURL(file);
    furl.replace(illegalRe, replacement)
      .replace(controlRe, replacement)
      .replace(reservedRe, replacement)
      .replace(windowsReservedRe, replacement)
      .replace(windowsTrailingRe, replacement)
      .replace(' ', '_');
    let filePtr = {
      file: file,
      url: furl,
      name: file.name,
    };
    var url = this.props.context.pageContext.web.serverRelativeUrl;
    sp.web.getFolderByServerRelativeUrl(url + "/FileDocument/")
      .files.add(filePtr.name, filePtr.file, true)
      .then((data) => {
        alert("File uploaded sucessfully");
        console.log("sdsdsd");
      })
      .catch((error) => {
        alert("Error");
        console.log("ererer");
      });
  }
  public render(): React.ReactElement<IFileUploadProps> {
    return (
      <div >
        <input type="file" ref={this._input}
          onChange={this.uploadFileFromControl}></input>
        <p>
          <button onClick={() => this.uploadFileFromControl} >
            Upload
          </button>
        </p>
      </div>
    );
  }
}
