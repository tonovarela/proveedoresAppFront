import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-cambiar-password',
  templateUrl: './cambiar-password.component.html',
  styleUrls: ['./cambiar-password.component.css']
})
export class CambiarPasswordComponent implements OnInit {

  formUpdate: FormGroup;
  hidePassword: boolean = false;
  actualizandoPassword: boolean = false;
  constructor(private fb: FormBuilder, private usuarioService: UsuarioService, private uiService: UiService) { }



  ngOnInit(): void {
    this.formUpdate = this.fb.group({
      password1: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      password2: ['', [Validators.required]],
    }, { validators: [this.checkPasswords,this.passwordNoRFC] });
  }


  checkPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    let pass = group.get('password1').value;
    let confirmPass = group.get('password2').value
    return pass === confirmPass ? null : { notMatch: true }
  }

  passwordNoRFC: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const { RFC } = this.usuarioService.usuario;
    let pass = group.get('password1').value;
    //let confirmPass = group.get('password2').value
    return pass !== RFC ? null : { noRFC: true }
  }



  actualizarPassword(event: any) {
    const { Proveedor: proveedor } = this.usuarioService.usuario;
    const { password1: password } = this.formUpdate.value;
    const request = { password, proveedor: proveedor.trim() }
    this.actualizandoPassword = true
    this.usuarioService.actualizarPassword(request).subscribe(response => {
      this.uiService.mostrarAlertaSuccess("Proveedores", response['mensaje']);
      setTimeout(() => {
        this.usuarioService.logout();
      }, 1000)

    });


  }

}
