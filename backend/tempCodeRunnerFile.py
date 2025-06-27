trainer.train()
trainer.save_model("models/bert_classifier")
tokenizer.save_pretrained("models/bert_classifier")