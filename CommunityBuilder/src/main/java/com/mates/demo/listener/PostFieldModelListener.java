package com.mates.demo.listener;

import com.mates.demo.domain.PostField;
import com.mates.demo.domain.PostType;
import com.mates.demo.service.SequenceGeneratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener;
import org.springframework.data.mongodb.core.mapping.event.BeforeConvertEvent;
import org.springframework.stereotype.Component;

@Component
public class PostFieldModelListener extends AbstractMongoEventListener<PostField>{

	private SequenceGeneratorService sequenceGenerator;

	@Autowired
	public PostFieldModelListener(SequenceGeneratorService sequenceGenerator) {
		this.sequenceGenerator = sequenceGenerator;
	}

	@Override
	public void onBeforeConvert(BeforeConvertEvent<PostField> event) {
		if (event.getSource().getId() < 1) {
			event.getSource().setId(sequenceGenerator.generateSequence(PostField.SEQUENCE_NAME));
		}
	}



}
