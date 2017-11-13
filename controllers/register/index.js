const projectPath = __dirname + '/../../';
const request   = require('request');
const templates = projectPath + 'src/views/';
const User      = require(projectPath + 'models/user');
const fs        = require('fs');

module.exports = {
    view: function(req, res) {
   		const url = "http://private-da937a-izitest1.apiary-mock.com/fields";
		const formAction = 'save.html';

		request({ url: url, json: true }, function (err, resp, body) {
		    if (!err && resp.statusCode === 200) {
		    	res.render(templates + 'index', {
					title: 'Home - MyProject',
					fields: body,
					formAction: formAction
				});
		    }
		});
    },

    save: function(req, res) {
    	let i;

		if (req.files.uplImage) {
			const inputFile = req.files.uplImage;
			const mimetype = inputFile.mimetype;
			const regex = /\w+\//g;
			const fileExt = mimetype.replace(regex, '.');

			if( fileExt !== '.png' && fileExt !== '.gif' && fileExt !== '.jpg') {
				return res.json({
					error: {
						message: 'Extensão de arquivo inválida. Permitido apenas .png/.gif/.jpg'
					}
				});
			}

			const newFilePathName = projectPath + '/uploads/thumb-' + req.body.txtCPF + fileExt;

			inputFile.mv(newFilePathName, function(err) {
				if (err) {
					return res.json({
						error: {
							message: 'Diretório não encontrado'
						}
					});
				}

				console.log('Upload completo');

				const signupUser = new User({
					name: req.body.txtFullname,
					cpf: req.body.txtCPF,
					phone: req.body.txtPhone,
					address: req.body.txtAddress, 
					thumb: '/uploads/thumb-' + req.body.txtCPF + fileExt
				});

				signupUser.save(function(err) {
					if (err) {
						return res.json({
							error: {
								message: err
							}
						});
					}	

					return res.json({
						success: {
							message: 'Usuário salvo com sucesso!'
						}
					})
				});
			});
		}
    },

    update: function(req, res) {
    	User.findById(req.body.hiddenId, (err, usr) => {  
			if (err) {
				res.status(500).send(err);
			} else {
				usr.name = req.body.txtFullname || usr.name;
				usr.cpf = req.body.txtCPF || usr.cpf;
				usr.phone = req.body.txtPhone || usr.phone;
				usr.address = req.body.txtAddress || usr.address;

				if (req.files.uplImage) {
					fs.stat(projectPath + usr.thumb, function (err, stats) {
						if (err) {
						   console.error(err);
						}

						fs.unlink(projectPath + usr.thumb, function (err) {
						    if(err) console.log(err);

						    console.log('Arquivo deletado com sucesso');

						    const inputFile = req.files.uplImage;
							const mimetype = inputFile.mimetype;
							const regex = /\w+\//g;
							const fileExt = mimetype.replace(regex, '.');
							const newFilePathName = projectPath + '/uploads/thumb-' + usr.cpf + fileExt;

							inputFile.mv(newFilePathName, function(err) {
								if (err) {
									console.log(err);
								}

								console.log('Upload realizado com sucesso');
								usr.thumb = '/uploads/thumb-' + usr.cpf + fileExt;

								usr.save(function (err, usr) {
									if (err) {
										return res.json({
											error: {
												message: 'Houve um erro ao tentar atualizar usuário.'
											}
										});
									}

									return res.json({
										success: {
											message: 'Usuário alterado com sucesso.'
										}
									});
								});
							});
						});  
					});
				} else {
					usr.thumb = usr.thumb;

					usr.save(function (err, usr) {
						if (err) {
							return res.json({
								error: {
									message: 'Houve um erro ao tentar atualizar usuário.'
								}
							});
						}

						return res.json({
							success: {
								message: 'Usuário alterado com sucesso.'
							}
						});
					});
				}				
			}
		});
    },

    edit: function(req, res) {
   		const url = "http://private-da937a-izitest1.apiary-mock.com/fields";
		const queryStr = req.query.id;
		const formAction = queryStr ? 'update.html' : 'save.html';
		let i;

		request({ url: url, json: true }, function (err, resp, body) {
		    if (!err && resp.statusCode === 200) {
	    		User.findById(queryStr, function (err, usr) {  
					if (err) {
						res.status(500).send(err)
					} else {
						for (i = 0; i < body.length; i++){
							switch(body[i].name) {
								case 'txtFullname':
									body[i].value = usr.name;
									break;

								case 'txtCPF':
									body[i].value = usr.cpf;
									break;

								case 'txtPhone':
									body[i].value = usr.phone;
									break;

								case 'txtAddress':
									body[i].value = usr.address;
									break;

								case 'uplImage':
									body[i].value = usr.thumb;
									break;
							}
				    	}
					}
				});

		    	res.render(templates + '/index', {
					title: 'Edit - MyProject',
					fields: body,
					formAction: formAction,
					id: queryStr
				});
		    }
		});
    },

    remove: function(req, res) {
    	var getUserId = req.query.id;
    	var thumbSrc;

    	User.findById(getUserId, function (err, usr) { 
    		thumbSrc = projectPath + usr.thumb;
    	});

		User.findOneAndRemove({_id: getUserId}, function (err) {
			fs.stat(thumbSrc, function (err, stats) {
				if (err) {
				   return console.error(err);
				}

				fs.unlink(thumbSrc, function (err) {
				    if(err) return console.log(err);
				    console.log('Arquivo deletado com sucesso');
				});  
			});

			if (err) {
				return res.json({
					error: {
						message: 'Houve um erro ao tentar excluir usuário.'
					}
				});
			}

			return res.json({
				success: {
					message: 'Usuário removido da base de dados.'
				}
			});
		});
    }
}
